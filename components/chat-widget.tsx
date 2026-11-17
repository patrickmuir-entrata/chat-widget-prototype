"use client";

import * as React from "react";
import { MessageCircle, X, ChevronLeft, Smile, Send } from "lucide-react";

type WidgetMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
};

const BOT_RESPONSES: Record<string, string> = {
  hello:
    "Hi there! 👋 I'm here to help you navigate the application. What can I help you with today?",
  help: "I can help you with:\n• Navigating the application\n• Understanding features\n• Troubleshooting issues\n• Finding specific pages or settings\n\nJust ask me anything!",
  application:
    "This is the Application Print page — it shows the full details for a rental application including applicant info, preferences, address history, and more. Use the sidebar links on the right to jump between sections.",
  lease:
    "You can view and manage lease applications from this page. The Application Print view shows applicant details, preferences, and status. Use the sidebar links to jump between Applicants, Preferences, Address Info, and more.",
  agent:
    "Agents are AI-powered assistants that handle tasks like responding to residents, processing applications, and managing communications. They can help automate your leasing workflow.",
  escalation:
    "Escalations are conversations that need human attention. When an AI agent can't fully resolve an issue, it escalates to staff for review and action.",
  status:
    "Application statuses track where a prospect is in the leasing process:\n• Started — application begun but incomplete\n• Submitted — ready for review\n• Approved — passed screening\n• Denied — did not pass screening\n• Cancelled — withdrawn by applicant or staff",
  default:
    "Thanks for your question! I'm still learning, but I can help with navigating the app, understanding features, and finding the right pages. Could you try rephrasing or ask about a specific feature?",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return BOT_RESPONSES.hello;
  if (lower.includes("help") || lower.includes("what can"))
    return BOT_RESPONSES.help;
  if (
    lower.includes("application") ||
    lower.includes("app") ||
    lower.includes("page")
  )
    return BOT_RESPONSES.application;
  if (
    lower.includes("lease") ||
    lower.includes("applicant") ||
    lower.includes("apply") ||
    lower.includes("rent")
  )
    return BOT_RESPONSES.lease;
  if (lower.includes("agent") || lower.includes("ai") || lower.includes("bot"))
    return BOT_RESPONSES.agent;
  if (
    lower.includes("escalat") ||
    lower.includes("issue") ||
    lower.includes("problem")
  )
    return BOT_RESPONSES.escalation;
  if (
    lower.includes("status") ||
    lower.includes("started") ||
    lower.includes("approved") ||
    lower.includes("denied")
  )
    return BOT_RESPONSES.status;
  return BOT_RESPONSES.default;
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<WidgetMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const userMsg: WidgetMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: WidgetMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: getBotReply(text),
        time: formatTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating "Chat with us" pill button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 rounded-full bg-[#F5A623] px-5 py-3 text-white font-semibold text-sm shadow-lg transition-all hover:bg-[#E6961E] hover:shadow-xl hover:scale-105 active:scale-100"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5 fill-white" />
          Chat with us
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9999] flex flex-col w-[380px] h-[540px] rounded-2xl bg-white overflow-hidden"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Sunset Ridge
              </p>
              <p className="text-xs text-gray-500">
                Typically replies in a few minutes
              </p>
            </div>
          </div>

          {/* Message area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-white px-4 py-4"
          >
            {messages.length === 0 && !isTyping && (
              <div className="flex h-full flex-col items-center justify-center text-center px-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623]/10">
                  <MessageCircle className="h-7 w-7 text-[#F5A623]" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Welcome to Sunset Ridge
                </p>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Ask us anything about the application — we&apos;re here to
                  help!
                </p>
              </div>
            )}

            <div className="space-y-3">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col gap-1",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        isUser
                          ? "bg-[#F5A623] text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 px-1">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start">
                  <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2 rounded-full border-2 border-red-400 bg-white px-4 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message"
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                aria-label="Type your message"
              />
              {draft.trim() ? (
                <button
                  onClick={handleSend}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-white transition-colors hover:bg-[#E6961E]"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Powered by Entrata */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 40 40"
                fill="none"
                className="opacity-40"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 0V40H40V0H0ZM8.625 20.375H5.375C5.5 21 6 21.5 6.625 21.5C7.125 21.5 7.5 21.25 7.875 21L8.625 21.75C8.125 22.25 7.375 22.625 6.625 22.625C5.125 22.625 4.125 21.625 4.125 20.125C4.125 18.75 5 17.625 6.5 17.625C7.875 17.625 8.75 18.75 8.75 20.125C8.75 20.125 8.75 20.25 8.625 20.375ZM14.25 22.5H12.875V20C12.875 19.5 12.75 19.25 12.625 19.125C12.375 18.875 12.125 18.75 11.875 18.75C11.375 18.75 11 19 10.75 19.375V22.5H9.5V17.75H10.75V18.125C11.125 17.75 11.625 17.625 12.125 17.625C12.75 17.625 13.375 17.875 13.75 18.375C14.125 18.75 14.25 19.25 14.25 20V22.5ZM17.875 18.75H16.25V21.25H17.5V22.5H16.25V21.25H15V16.375H16.25V17.75H17.875V18.75ZM19.875 19.625V22.5H18.625V17.75H19.875V18.25C20.125 17.875 20.625 17.625 21.25 17.625H21.625V18.875H21C20.5 18.875 20.125 19.125 19.875 19.625ZM26.5 22.5H25.375V22.125C25 22.5 24.5 22.625 24 22.625C23.25 22.625 22.625 22.375 22.125 21.75C21.75 21.25 21.5 20.625 21.5 20.125C21.5 18.75 22.5 17.625 23.875 17.625C24.375 17.625 24.875 17.75 25.25 18.125V17.75H26.5V22.5ZM30.25 22.5H29V21.25H30.25V22.5ZM30.5 18.75H28.875V21.25H27.625V16.375H28.875V17.75H30.5V18.75ZM35.75 22.5H34.625V22.125C34.25 22.5 33.75 22.625 33.25 22.625C32.5 22.625 31.875 22.375 31.375 21.75C31 21.25 30.75 20.625 30.75 20.125C30.75 18.75 31.75 17.625 33.125 17.625C33.625 17.625 34.125 17.75 34.5 18.125V17.75H35.75V22.5ZM6.5 18.625C6 18.625 5.5 19 5.5 19.5H7.5C7.375 19 6.875 18.625 6.5 18.625ZM23 20.125C23 20.875 23.5 21.375 24.25 21.375C24.75 21.375 25.125 21.125 25.375 20.75V19.25C25.125 19 24.625 18.75 24.25 18.75C23.5 18.75 23 19.375 23 20.125ZM33.375 18.75C32.625 18.75 32.125 19.375 32.125 20.125C32.125 20.875 32.625 21.375 33.375 21.375C33.875 21.375 34.25 21.125 34.5 20.75V19.25C34.375 19 33.875 18.75 33.375 18.75Z"
                  fill="#383838"
                />
              </svg>
              <span className="text-[11px] text-gray-400 font-medium">
                Powered by Entrata
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Close FAB (replaces "Chat with us" when panel is open) ── */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623] text-white shadow-lg transition-all hover:bg-[#E6961E] hover:shadow-xl"
          aria-label="Close chat"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
