"use client";

import type { MessageLog } from "@/lib/db/schema";

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function CaseMessages({ messages }: { messages: MessageLog[] }) {
  // Sort messages oldest-first for display
  const sorted = [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <section className="bg-[#eff4ff] rounded-2xl p-10 flex flex-col h-[850px] shadow-sm border border-[#bdc9ca]/10">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight">
            Communication Log
          </h2>
          <p className="text-sm text-[#3e494a] font-medium mt-1">
            Real-time collaboration with stakeholders
          </p>
        </div>
        <button className="bg-white/50 border-2 border-[#006872]/20 px-6 py-2.5 rounded-full text-xs font-black text-[#006872] uppercase tracking-widest flex items-center gap-2 hover:bg-[#006872] hover:text-white transition-all shadow-sm">
          <span className="material-symbols-outlined text-lg">
            support_agent
          </span>
          Take over from AI
        </button>
      </div>

      {/* Dual Thread Tab Toggle */}
      <div className="flex bg-[#d0daf0]/50 p-1.5 rounded-full mb-10 shrink-0 border border-[#bdc9ca]/10">
        <button className="flex-1 py-3 px-6 rounded-full text-sm font-black text-white bg-[#006872] shadow-lg transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-xl">person</span>
          Tenant Thread
        </button>
        <button className="flex-1 py-3 px-6 rounded-full text-sm font-bold text-[#3e494a] hover:bg-[#dce9ff] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-xl">
            engineering
          </span>
          Contractor Thread
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
        </button>
      </div>

      {/* Message Bubbles Area */}
      <div className="flex-grow space-y-10 overflow-y-auto pr-4 custom-scrollbar">
        {sorted.map((msg) => {
          const isInbound = msg.direction === "inbound";
          const isSystem = msg.messageType === "system_notification";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="px-6 py-2 bg-[#bdc9ca]/10 rounded-full border border-[#bdc9ca]/20">
                  <p className="text-[10px] font-bold text-[#3e494a] uppercase tracking-widest">
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
                    <span className="text-sm font-bold text-[#0d1c2e]">
                      {msg.fromAddress}
                    </span>
                    <span className="text-[10px] text-[#3e494a] uppercase tracking-widest font-bold">
                      Tenant &bull; {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <div className="bg-white text-[#0d1c2e] p-7 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-md shadow-sm border border-[#bdc9ca]/10">
                    <p className="text-base leading-relaxed">{msg.body}</p>
                  </div>
                </div>
              </div>
            );
          }

          // Outbound messages
          const isAI = msg.messageType === "ai_response";
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[75%] space-y-2 text-right">
                <div className="flex items-center justify-end gap-3 mb-1 px-1">
                  <span className="flex items-center gap-1 text-[10px] text-[#3e494a] uppercase tracking-widest font-bold">
                    {isAI && (
                      <span className="material-symbols-outlined text-xs">
                        smart_toy
                      </span>
                    )}
                    {isAI ? "PropAgent AI" : "Property Management"} &bull;{" "}
                    {formatTime(msg.createdAt)}
                  </span>
                  <span
                    className={`text-sm font-extrabold ${isAI ? "text-[#006872]" : "text-[#426469]"}`}
                  >
                    {isAI ? "PropAgent Support" : msg.fromAddress}
                  </span>
                </div>
                <div
                  className={`p-7 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-md text-left ${
                    isAI
                      ? "bg-[#00838f] text-white shadow-lg"
                      : "bg-[#d0daf0] text-[#0d1c2e] shadow-sm border border-[#bdc9ca]/20"
                  }`}
                >
                  <p className="text-base leading-relaxed">{msg.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-[#3e494a] text-sm font-medium">
              No messages yet for this case.
            </p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-10 bg-white rounded-xl p-4 border-2 border-[#006872]/20 focus-within:ring-2 focus-within:ring-[#006872]/40 focus-within:border-[#006872] transition-all shadow-md shrink-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-[#006872] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006872]"></span>
              Replying to Tenant Thread
            </span>
            <div className="flex gap-4">
              <button className="p-1 text-[#3e494a] hover:text-[#006872] transition-colors">
                <span className="material-symbols-outlined text-lg">
                  attach_file
                </span>
              </button>
              <button className="p-1 text-[#3e494a] hover:text-[#006872] transition-colors">
                <span className="material-symbols-outlined text-lg">mood</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <input
              className="flex-grow bg-transparent border-none focus:ring-0 text-base placeholder:text-[#3e494a]/40 px-4"
              placeholder="Type your message as Property Management..."
              type="text"
            />
            <button className="bg-[#006872] text-white px-8 py-3.5 rounded-full font-extrabold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2">
              <span>Send Message</span>
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
