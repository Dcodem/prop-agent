import { MessageSquare } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import type { MessageLog } from "@/lib/db/schema";

interface CaseMessagesProps {
  messages: MessageLog[];
  className?: string;
}

export function CaseMessages({ messages, className }: CaseMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
          <MessageSquare className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            No messages yet
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Messages will appear here when communication begins
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {messages.map((msg) => {
        const isInbound = msg.direction === "inbound";
        return (
          <div
            key={msg.id}
            className={cn("flex", isInbound ? "justify-start" : "justify-end")}
          >
            <div
              className={cn(
                isInbound
                  ? "max-w-[80%] bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm"
                  : "max-w-[80%] bg-[#006872] text-white p-3 rounded-2xl rounded-tr-none shadow-sm"
              )}
            >
              <p className="text-sm">{msg.body}</p>
              <span
                className={cn(
                  isInbound
                    ? "text-[10px] text-slate-400 block mt-1"
                    : "text-[10px] opacity-70 block text-right mt-1"
                )}
              >
                {msg.channel === "email" ? "Email" : "SMS"} ·{" "}
                {timeAgo(msg.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
