"use client"

import { motion } from "framer-motion"

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className="w-2 h-2 rounded-full bg-[#0a84ff]"
        />
      ))}
    </div>
  )
}
