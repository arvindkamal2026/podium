"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PIStudyChatProps {
  eventName: string;
  piText: string;
}

export function PIStudyChat({ eventName, piText }: PIStudyChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName, piText, message: userMessage, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-cta flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <span className="material-symbols-outlined text-2xl">smart_toy</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-surface-container-low rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="frosted-glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
          <span className="text-sm font-semibold text-on-surface">PI Study Assistant</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-outline hover:text-on-surface">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-3xl text-outline mb-2 block">chat</span>
            <p className="text-sm text-outline">Ask me about this PI or related business concepts.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-primary/10 text-on-surface"
                : "bg-surface-container text-on-surface-variant"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-container rounded-xl px-4 py-2.5">
              <span className="material-symbols-outlined text-sm text-outline animate-spin">progress_activity</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-surface-container">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about this PI..."
            className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="gradient-cta rounded-xl px-4 py-2.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
