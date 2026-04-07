"use client";

import { useState, useRef, useEffect } from "react";
import type { MessageLog } from "@/lib/db/schema";

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const MOCK_CONTRACTOR_MESSAGES = [
  { id: "cm1", body: "Confirmed arrival for tomorrow 9:00 AM. Will bring standard toolkit.", direction: "inbound" as const, fromAddress: "Mike's Plumbing", createdAt: new Date(Date.now() - 3600000 * 3), messageType: "sms" },
  { id: "cm2", body: "Parts ordered from supplier — ETA 2 business days. Will update once they arrive.", direction: "inbound" as const, fromAddress: "Mike's Plumbing", createdAt: new Date(Date.now() - 3600000), messageType: "sms" },
  { id: "cm3", body: "Job completed. Replaced valve assembly and tested water pressure. Awaiting tenant inspection sign-off.", direction: "inbound" as const, fromAddress: "Mike's Plumbing", createdAt: new Date(Date.now() - 1800000), messageType: "sms" },
];

const EMOJIS = ["👍", "😊", "🔧", "🏠", "📋", "✅", "❌", "⚠️", "🔑", "💧", "🔌", "❄️", "🔥", "📞", "📧", "👷", "🏗️", "🧹", "💡", "🚿"];

export function CaseMessages({ messages }: { messages: MessageLog[] }) {
  const [activeThread, setActiveThread] = useState<"tenant" | "contractor">("tenant");
  const [aiActive, setAiActive] = useState(true);
  const [inputText, setInputText] = useState("");
  const [localMessages, setLocalMessages] = useState<Array<{
    id: string; body: string; direction: "inbound" | "outbound"; fromAddress: string; createdAt: Date; messageType: string;
  }>>([]);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMounted = useRef(false);

  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const allTenantMessages = [...sorted, ...localMessages.filter((m) => m.messageType !== "contractor")].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const contractorMessages = [...MOCK_CONTRACTOR_MESSAGES, ...localMessages.filter((m) => m.messageType === "contractor")].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const displayMessages = activeThread === "tenant" ? allTenantMessages : contractorMessages;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [localMessages, activeThread]);

  function handleSend() {
    if (!inputText.trim() && !attachedFile) return;
    const body = attachedFile ? `${inputText.trim()} [Attached: ${attachedFile}]` : inputText.trim();
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        body,
        direction: "outbound",
        fromAddress: "Property Management",
        createdAt: new Date(),
        messageType: activeThread === "contractor" ? "contractor" : "pm_response",
      },
    ]);
    setInputText("");
    setAttachedFile(null);
    setShowEmoji(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="bg-primary-fixed rounded-2xl p-10 flex flex-col h-[850px] shadow-sm border border-outline-variant/10">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Communication Log</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Real-time collaboration with stakeholders</p>
        </div>
        <button
          onClick={() => setAiActive(!aiActive)}
          className={`border-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${
            aiActive
              ? "bg-surface-container-lowest/50 border-accent/20 text-accent hover:bg-accent hover:text-on-accent"
              : "bg-accent border-accent text-on-accent hover:bg-accent/90"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {aiActive ? "support_agent" : "person"}
          </span>
          {aiActive ? "Take over from AI" : "Re-enable AI Agent"}
        </button>
      </div>

      {/* Thread Tabs */}
      <div className="flex bg-outline-variant/20 p-1.5 rounded-full mb-6 shrink-0 border border-outline-variant/10">
        <button
          onClick={() => setActiveThread("tenant")}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeThread === "tenant"
              ? "text-on-accent bg-accent shadow-lg"
              : "text-on-surface-variant hover:bg-primary-fixed"
          }`}
        >
          <span className="material-symbols-outlined text-xl text-purple">person</span>
          Tenant Thread
        </button>
        <button
          onClick={() => setActiveThread("contractor")}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeThread === "contractor"
              ? "text-on-accent bg-accent shadow-lg"
              : "text-on-surface-variant hover:bg-primary-fixed"
          }`}
        >
          <span className="material-symbols-outlined text-xl text-warning-dim">engineering</span>
          Contractor Thread
          {activeThread !== "contractor" && (
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          )}
        </button>
      </div>

      {/* AI takeover banner */}
      {!aiActive && (
        <div className="mb-4 px-4 py-3 bg-surface-container-high border border-outline-variant/20 rounded-lg flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">info</span>
          <p className="text-sm font-medium text-on-surface">You are now managing this conversation directly</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-grow space-y-10 overflow-y-auto pr-4 custom-scrollbar">
        {displayMessages.map((msg) => {
          const isInbound = msg.direction === "inbound";
          const isSystem = msg.messageType === "system_notification";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="px-6 py-2 bg-outline-variant/10 rounded-full border border-outline-variant/20">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {msg.body} &bull; {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          }

          if (isInbound) {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[75%] space-y-2">
                  <div className="flex items-center gap-3 mb-1 px-1">
                    <span className="text-sm font-bold text-on-surface">{msg.fromAddress}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                      {activeThread === "contractor" ? "Contractor" : "Tenant"} &bull; {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface p-7 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-md shadow-sm border border-outline-variant/10">
                    <p className="text-base leading-relaxed">{msg.body}</p>
                  </div>
                </div>
              </div>
            );
          }

          const isAI = msg.messageType === "ai_response";
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[75%] space-y-2 text-right">
                <div className="flex items-center justify-end gap-3 mb-1 px-1">
                  <span className="flex items-center gap-1 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                    {isAI && <span className="material-symbols-outlined text-xs text-purple">smart_toy</span>}
                    {isAI ? "PropAgent AI" : "Property Management"} &bull; {formatTime(msg.createdAt)}
                  </span>
                  <span className={`text-sm font-extrabold ${isAI ? "text-accent" : "text-on-surface-variant"}`}>
                    {isAI ? "PropAgent Support" : msg.fromAddress}
                  </span>
                </div>
                <div className={`p-7 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-md text-left ${
                  isAI ? "bg-accent text-on-accent shadow-lg" : "bg-outline-variant/20 text-on-surface shadow-sm border border-outline-variant/20"
                }`}>
                  <p className="text-base leading-relaxed">{msg.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {displayMessages.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full gap-2">
            <span className="material-symbols-outlined text-3xl text-outline">forum</span>
            <p className="text-on-surface-variant text-sm font-medium">
              No messages in this thread yet. Start the conversation below.
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-6 shrink-0">
        {/* AI Suggestion Chips */}
        {aiActive && activeThread === "tenant" && (
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1 mr-1">
              <span className="material-symbols-outlined text-xs">smart_toy</span>
              AI Suggest
            </span>
            {[
              { label: "Draft response", icon: "edit_note" },
              { label: "Schedule maintenance", icon: "calendar_month" },
              { label: "Escalate to vendor", icon: "escalator_warning" },
              { label: "Request photos", icon: "photo_camera" },
              { label: "Mark resolved", icon: "check_circle" },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  setInputText(chip.label === "Draft response"
                    ? "Hi, thank you for reporting this issue. We've assigned a vendor and they will be in touch shortly to schedule a visit."
                    : chip.label === "Schedule maintenance"
                    ? "We'd like to schedule a maintenance visit. Are you available this week? Please let us know your preferred times."
                    : chip.label === "Escalate to vendor"
                    ? "Escalating this to our vendor team for immediate attention."
                    : chip.label === "Request photos"
                    ? "Could you please send photos of the issue? This will help our team assess the situation more quickly."
                    : "This issue has been resolved. Please let us know if you experience any further problems."
                  );
                  inputRef.current?.focus();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-accent/20 rounded-full text-xs font-bold text-accent hover:bg-accent hover:text-on-accent transition-all hover:shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Attached file pill */}
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm">attach_file</span>
              {attachedFile}
              <button onClick={() => setAttachedFile(null)} className="hover:text-error transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </span>
          </div>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div className="mb-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 shadow-lg flex flex-wrap gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-primary-fixed text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl p-4 border-2 border-accent/20 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent transition-all shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Replying to {activeThread === "tenant" ? "Tenant" : "Contractor"} Thread
              </span>
              <div className="flex gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAttachedFile(file.name);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-on-surface-variant hover:text-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">attach_file</span>
                </button>
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`p-1 transition-colors ${showEmoji ? "text-accent" : "text-on-surface-variant hover:text-accent"}`}
                >
                  <span className="material-symbols-outlined text-lg">mood</span>
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <input
                ref={inputRef}
                className="flex-grow bg-transparent border-none focus:ring-0 text-base placeholder:text-on-surface-variant/40 px-4"
                placeholder={`Type your message as Property Management...`}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() && !attachedFile}
                className="bg-accent text-on-accent px-8 py-3.5 rounded-full font-extrabold text-sm hover:bg-accent/90 active:scale-95 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <span>Send Message</span>
                <span className="material-symbols-outlined text-lg text-accent">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
