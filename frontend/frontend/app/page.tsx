"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MessageBubble from "@/components/message-bubble";
import MessageCard from "@/components/message-card";
import EmptyState from "@/components/empty-state";
import TypingIndicator from "@/components/typing-indicator";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  // Sample iMessage data for demonstration
  const sampleMessages = [
    {
      id: "1",
      contact: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Hey, are we still on for dinner tonight at 7?",
      timestamp: "Today, 2:34 PM",
    },
    {
      id: "2",
      contact: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "I was thinking we could try that new Italian place on Main St.",
      timestamp: "Today, 2:35 PM",
    },
    {
      id: "3",
      contact: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Let me know if that works for you!",
      timestamp: "Today, 2:36 PM",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-zinc-100">
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-500/10 to-blue-600/20 h-1 w-full"></div>

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto py-8 px-6 pb-24">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              <AnimatePresence initial={false}>
                {messages
                  .filter((message) => message.role !== "data")
                  .map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <MessageBubble
                        role={message.role as "user" | "assistant" | "system"}
                      >
                        {message.content}

                        {/* Show iMessage data cards in assistant messages */}
                        {message.role === "assistant" &&
                          message.content.includes(
                            "conversations with Sarah"
                          ) && (
                            <div className="mt-3 space-y-2">
                              {sampleMessages.map((msg) => (
                                <MessageCard key={msg.id} message={msg} />
                              ))}
                            </div>
                          )}
                      </MessageBubble>
                    </motion.div>
                  ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 rounded-2xl p-4 max-w-[80%] shadow-md border border-gray-700/60">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <div className="relative z-10">
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent pt-8">
          <div className="mx-auto max-w-2xl px-6 pb-6">
            <form
              onSubmit={onSubmit}
              className="relative bg-gray-800 rounded-xl p-2 border border-gray-700/50 shadow-lg"
            >
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about your messages..."
                className="w-full bg-transparent py-3 px-4 pr-16 focus:outline-none text-zinc-100 placeholder:text-zinc-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2">
                <button
                  type="button"
                  className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <Mic size={18} />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    input.trim() && !isLoading
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-700 text-zinc-400"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
