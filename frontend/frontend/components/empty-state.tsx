"use client";

import { motion } from "framer-motion";

export default function EmptyState() {
  const examplePrompts = [
    "Show me conversations with Sarah",
    "Find messages about dinner plans",
    "Summarize my chat with John",
    "When did Alex last message me?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col items-center justify-center text-center px-4 py-12"
    >
      <div className="w-32 h-32 mb-8 rounded-full bg-gradient-to-br from-[#0a84ff] to-[#6366f1] opacity-90 flex items-center justify-center shadow-[0_0_30px_rgba(10,132,255,0.3)]">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-3">
        Welcome to iMessage Assistant
      </h2>
      <p className="text-zinc-400 max-w-md mb-8">
        Ask questions about your messages or try one of these examples:
      </p>

      <div className="grid gap-3 max-w-md w-full">
        {examplePrompts.map((prompt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-left cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <p className="text-zinc-300">{prompt}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
