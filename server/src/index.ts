import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "take-screenshot",
  version: "1.0.0",
  capabilities: {
    resources: {
      screenshot: {
        description: "A screenshot of a website",
        schema: z.object({
          url: z.string().url(),
        }),
      },
    },
  },
});

server.tool(
  "take-screenshot",
  "Take a screenshot of a website",
  {
    url: z
      .string()
      .url()
      .describe(
        "The URL of the website to screenshot. For example, http://localhost:3000"
      ),
  },
  async ({ url }, _extra) => {
    // do something with url

    return {
      structuredContent: {
        image: {
          //   data: screenshotBuffer,
          mimeType: "image/png",
          encoding: "base64",
        },
        text: "This is a screenshot for a page you requested:",
      },
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Website screenshot MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
