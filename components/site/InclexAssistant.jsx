"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Sparkles, ArrowUpRight, RotateCcw } from "lucide-react";

const STARTERS = [
  "What is Keyfume?",
  "How do I refill it?",
  "What makes Keyfume special?",
  "How can I track my order?",
];

const welcome = {
  role: "assistant",
  text: "Hello! Welcome to INCLEX. 👋\n\nI'm your virtual customer support executive. I can help you explore Keyfume, understand how it works, learn about delivery and returns, or get help with an order.\n\nWhat can I help you with today?",
};

function MessageText({ text }) {
  return <p className="whitespace-pre-wrap break-words text-[13px] leading-6">{text}</p>;
}

export default function InclexAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const pathname = usePathname();
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setConversationId(globalThis.crypto?.randomUUID?.() || `inclex-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  async function sendMessage(value = input) {
    const text = String(value || "").trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: text,
          history: next.slice(-13, -1).map((item) => ({
            role: item.role === "assistant" ? "model" : "user",
            text: item.text,
          })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "I couldn't send that message. Please try again.");
      setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error.message || "I'm having trouble connecting right now. Please email support@inclex.com and our team will help." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    setMessages([welcome]);
    setConversationId(globalThis.crypto?.randomUUID?.() || `inclex-${Date.now()}`);
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {open && (
        <section
          aria-label="INCLEX AI customer support"
          className="fixed bottom-24 right-4 z-[90] flex h-[min(690px,calc(100dvh-120px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#F8F7F4] shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:bottom-24 sm:right-6"
        >
          <header className="flex items-center gap-3 bg-[#111111] px-4 py-4 text-white">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#C9A227]/50 bg-[#C9A227]/10 text-[#D8B64A]">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-[17px] tracking-wide">INCLEX Assistant</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] tracking-wide text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> HERE TO HELP · AI CUSTOMER SUPPORT
              </div>
            </div>
            <button onClick={resetChat} aria-label="Start a new chat" title="New chat" className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white">
              <RotateCcw size={16} />
            </button>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white">
              <X size={19} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-3.5 py-4">
            <div className="text-center text-[10px] uppercase tracking-[0.18em] text-neutral-400">Your INCLEX conversation</div>
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="mr-2 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-[#111111] text-[#D8B64A]"><Sparkles size={13} /></div>
                )}
                <div className={message.role === "user"
                  ? "max-w-[83%] rounded-2xl rounded-br-md bg-[#171717] px-3.5 py-2.5 text-white"
                  : "max-w-[86%] rounded-2xl rounded-bl-md border border-black/5 bg-white px-3.5 py-3 text-neutral-800 shadow-sm"}>
                  <MessageText text={message.text} />
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-9">
                {STARTERS.map((starter) => (
                  <button key={starter} onClick={() => sendMessage(starter)} className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-2 text-left text-[11px] text-neutral-700 transition hover:border-[#C9A227] hover:bg-[#C9A227]/10">
                    {starter}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 pl-9 text-xs text-neutral-500">
                <span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9A227]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9A227] [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C9A227] [animation-delay:240ms]" /></span>
                INCLEX Assistant is typing…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-black/10 bg-white p-3">
            <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex items-end gap-2 rounded-xl border border-black/10 bg-[#F8F7F4] p-2 focus-within:border-[#C9A227] focus-within:ring-2 focus-within:ring-[#C9A227]/15">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }}
                rows={1}
                maxLength={1200}
                placeholder="Ask us anything…"
                aria-label="Message INCLEX Assistant"
                className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-2 text-[13px] text-neutral-800 outline-none placeholder:text-neutral-400"
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-[#C9A227] text-black transition hover:bg-[#b8901f] disabled:cursor-not-allowed disabled:opacity-40">
                <Send size={15} />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[9px] text-neutral-400">
              <span>Chats may be saved for support. Never share passwords, OTPs or payment details.</span>
              <a href="/contact" className="flex flex-shrink-0 items-center gap-0.5 text-neutral-600 hover:text-black">Human support <ArrowUpRight size={10} /></a>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close INCLEX assistant" : "Chat with INCLEX"}
        className="fixed bottom-5 right-5 z-[91] flex h-14 items-center gap-2.5 rounded-full bg-[#111111] px-5 text-white shadow-[0_12px_35px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 sm:bottom-6 sm:right-6"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} className="text-[#D8B64A]" />}
        <span className="text-xs font-semibold tracking-[0.12em]">{open ? "CLOSE" : "ASK INCLEX"}</span>
      </button>
    </>
  );
}
