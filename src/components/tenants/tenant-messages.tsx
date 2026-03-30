import type { MessageLog } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TenantMessagesProps {
  messages: MessageLog[];
}

export function TenantMessages({ messages }: TenantMessagesProps) {
  if (messages.length === 0) {
    return (
      <p className="text-sm text-muted">No communication history yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex items-start gap-3 rounded-lg border border-border p-3"
        >
          <div className="mt-0.5">
            {msg.direction === "inbound" ? (
              <ArrowDownLeft className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-text">
                {msg.direction === "inbound" ? "Received" : "Sent"}
              </span>
              <Badge variant="trade" value={msg.channel} />
              <span className="text-xs text-muted ml-auto">
                {timeAgo(msg.createdAt)}
              </span>
            </div>
            <p className="text-sm text-muted truncate">
              {msg.body.length > 120
                ? msg.body.slice(0, 120) + "..."
                : msg.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
