import { MessageSquare } from "lucide-react"

export default function Header() {
  return (
    <header className="py-4 px-6 border-b border-zinc-800 backdrop-blur-md bg-zinc-900/90 sticky top-0 z-10">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a84ff] to-[#6366f1] flex items-center justify-center shadow-[0_0_15px_rgba(10,132,255,0.5)]">
            <MessageSquare size={20} className="text-white" />
          </div>
          <h1 className="ml-3 text-xl font-semibold text-white">iMessage Assistant</h1>
        </div>
      </div>
    </header>
  )
}
