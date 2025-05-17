"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface MessageCardProps {
  message: {
    id: string
    contact: string
    avatar: string
    message: string
    timestamp: string
  }
}

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-3 border border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0">
          <Image src={message.avatar || "/placeholder.svg"} alt={message.contact} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className="font-medium text-zinc-200 truncate">{message.contact}</h4>
            <span className="text-xs text-zinc-400 flex-shrink-0">{message.timestamp}</span>
          </div>
          <p className="text-sm text-zinc-300 truncate">{message.message}</p>
        </div>
      </div>
    </motion.div>
  )
}
