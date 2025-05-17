import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getOutboundMessages } from "./queries.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "imessage-assistant",
  version: "1.0.0",
  capabilities: {
    resources: {
      messages: {
        description: "Get messages that the user has sent",
        schema: z.object({
          messages: z.array(z.string()),
        }),
      },
    },
  },
});

server.tool(
  "get-outbound-messages",
  "Get all messages that the user has sent",
  {
    take: z.number().optional(),
  },
  async ({ take = 10 }, _extra) => {
    const messages = await getOutboundMessages({ take });

    return {
      structuredContent: {
        text: JSON.stringify(messages),
      },
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});


// we have all the imessage data. here's some idea features:
// get alarms from messaging yourself
// track when you forget to respond to messages
// add a gcal event from a message
// analyze sentiment of conversations over time
// summarize long message threads
// detect and highlight important dates or deadlines mentioned
// auto-generate message replies based on context
// visualize messaging frequency with different contacts
// extract and save shared links or files
// detect group chat decisions or polls
// remind you to follow up on unanswered questions
// search messages by topic or sentiment
// detect and alert for scam or spam messages
// auto-tag messages with custom labels
// integrate with task managers to create todos from messages
