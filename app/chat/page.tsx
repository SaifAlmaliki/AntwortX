"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Replace with your actual n8n webhook URL
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://your-n8n-instance.com/webhook/path";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      // First try to get the response as text
      const responseText = await response.text();
      let responseContent;
      
      // Try to parse as JSON, but if it fails, use the raw text
      try {
        const data = JSON.parse(responseText);
        responseContent = data.response || responseText;
      } catch (error) {
        // If JSON parsing fails, use the raw text as the response
        console.log("Response is not JSON, using as plain text:", responseText);
        responseContent = responseText;
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get a response. Please try again.");
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-[#0a0a0a] border-b border-[#222] py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#1a1a1a]">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">AntwortX Support Chat</h1>
          </div>
          <div className="text-sm text-gray-400">
            Powered by AI
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden container mx-auto p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" ? (
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">AX</AvatarFallback>
                      <AvatarImage src="/bot-avatar.png" />
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback className="bg-[#222] text-white">U</AvatarFallback>
                      <AvatarImage src="/user-avatar.png" />
                    </Avatar>
                  )}
                  <div
                    className={`p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-[#151515] border border-[#222] text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-[#0a0a0a] border-t border-[#222] rounded-lg shadow-lg">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-[#151515] border-[#333] text-white"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
