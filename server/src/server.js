import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Anthropic } from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import dotenv from "dotenv";

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set");
}

class MCPClient {
  mcp;
  anthropic;
  transport = null;
  tools = [];

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    this.mcp = new Client({ name: "mcp-client-web", version: "1.0.0" });
  }

  async connectToServer() {
    try {
      this.transport = new StdioClientTransport({
        command: "python3",
        args: ["YOUR_MCP_SERVER_PATH"],
      });

      this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      });

      console.log(
        "Connected to server with tools:",
        this.tools.map(({ name }) => name)
      );

      serverConnected = true;
      return true;
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      serverConnected = false;
      return false;
    }
  }

  async processQuery(phoneNumber, query) {
    const formattedQuery = `For the phone number ${phoneNumber}, ${query}`;

    const messages = [
      {
        role: "user",
        content: formattedQuery,
      },
    ];

    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages,
      tools: this.tools,
    });

    const finalText = [];
    const toolResults = [];

    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool_use") {
        const toolName = content.name;
        const toolArgs = content.input;

        finalText.push(
          `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
        );

        const result = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgs,
        });

        toolResults.push(result);

        messages.push({
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: content.id,
              name: toolName,
              input: toolArgs,
            },
          ],
        });

        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: content.id,
              content: result.content,
            },
          ],
        });

        const followUpResponse = await this.anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages,
        });

        finalText.push(
          followUpResponse.content[0].type === "text"
            ? followUpResponse.content[0].text
            : ""
        );
      }
    }

    return finalText.join("\n");
  }

  async cleanup() {
    if (this.mcp) {
      await this.mcp.close();
    }
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "../../frontend")));

// MCP Client setup
const mcpClient = new MCPClient();
let serverConnected = false;

// Routes
app.get("/api/status", (req, res) => {
  res.json({ connected: serverConnected });
});

app.post("/api/connect", async (req, res) => {
  const success = await mcpClient.connectToServer();
  res.json({ success });
});

app.post("/api/query", async (req, res) => {
  try {
    const { phoneNumber, query } = req.body;

    if (!phoneNumber || !query) {
      return res
        .status(400)
        .json({ error: "Phone number and query are required" });
    }

    if (!serverConnected) {
      await mcpClient.connectToServer();
    }

    const response = await mcpClient.processQuery(phoneNumber, query);
    res.json({ response });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await mcpClient.connectToServer();
  } catch (error) {
    console.error("Failed to connect to MCP server on startup:", error);
  }
});

// Handle shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mcpClient.cleanup();
  process.exit(0);
});
