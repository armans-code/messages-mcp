import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MessageBubbleProps {
  role: "user" | "assistant" | "system"
  children: ReactNode
}

export default function MessageBubble({ role, children }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "max-w-[80%] rounded-2xl p-4 shadow-md",
        role === "user"
          ? "bg-gradient-to-br from-[#0a84ff] to-[#0a84ff]/90 text-white"
          : "bg-zinc-800 border border-zinc-700 text-zinc-100 shadow-[0_0_10px_rgba(0,0,0,0.1)]",
      )}
    >
      <div className="text-[15px] leading-relaxed font-normal">{children}</div>
    </div>
  )
}
