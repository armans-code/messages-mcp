import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are an iMessage Assistant, helping users find and analyze their messages. Be concise, helpful, and friendly.",
  })

  return result.toDataStreamResponse()
}
