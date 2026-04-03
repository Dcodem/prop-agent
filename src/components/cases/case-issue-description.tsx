"use client";

import { useState } from "react";
import Image from "next/image";

type Message = {
  id: string;
  body: string;
  direction: "inbound" | "outbound";
  fromAddress: string;
  messageType: string;
  createdAt: string;
};

// Mock images that a tenant might attach to a maintenance report
const MOCK_ATTACHMENTS: Record<string, { url: string; alt: string }[]> = {
  plumbing: [
    { url: "/properties/142-oak-street.jpg", alt: "Photo of leak under kitchen sink" },
  ],
  electrical: [
    { url: "/properties/88-commerce-blvd.jpg", alt: "Photo of damaged outlet" },
  ],
  hvac: [
    { url: "/properties/7-maple-lane.jpg", alt: "Photo of AC unit" },
  ],
};

function formatMessageTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function CaseIssueDescription({
  rawMessage,
  category,
  messages,
  tenantName,
}: {
  rawMessage: string;
  category: string | null;
  messages: Message[];
  tenantName: string;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  // Get mock attachments based on category
  const categoryKey = category?.toLowerCase() ?? "plumbing";
  const attachments = MOCK_ATTACHMENTS[categoryKey] ?? MOCK_ATTACHMENTS.plumbing;

  // Build conversation context from messages (exclude system notifications)
  const conversationMessages = messages
    .filter((m) => m.messageType !== "system_notification")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const visibleUpdates = showAllUpdates
    ? conversationMessages
    : conversationMessages.slice(0, 3);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
      {/* Original Report */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            description
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-on-surface mb-3 tracking-tight">
            Issue Description
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed font-normal">
            &ldquo;{rawMessage}&rdquo;
          </p>
        </div>
      </div>

      {/* Attached Images */}
      {attachments.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Attached Photos
          </p>
          <div className="flex gap-3">
            {attachments.map((att) => (
              <button
                key={att.url}
                onClick={() => setPreviewImage(att.url)}
                className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-outline-variant/20 hover:border-primary/40 transition-all group"
              >
                <Image
                  src={att.url}
                  alt={att.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="128px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                    zoom_in
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Context */}
      {conversationMessages.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">forum</span>
              Conversation Updates
            </p>
            <span className="text-xs text-on-surface-variant font-medium">
              {conversationMessages.length} message{conversationMessages.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            {visibleUpdates.map((msg) => {
              const isInbound = msg.direction === "inbound";
              const isAI = msg.messageType === "ai_response";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isInbound ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isInbound
                        ? "bg-primary/10 text-primary"
                        : isAI
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {isInbound ? (
                      tenantName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                    ) : isAI ? (
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    ) : (
                      "PM"
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
                      isInbound
                        ? "bg-surface-container-low text-on-surface"
                        : isAI
                        ? "bg-primary/10 text-on-surface"
                        : "bg-outline-variant/10 text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs">
                        {isInbound ? msg.fromAddress : isAI ? "PropAgent AI" : "Property Management"}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="leading-relaxed">{msg.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {conversationMessages.length > 3 && (
            <button
              onClick={() => setShowAllUpdates(!showAllUpdates)}
              className="mt-4 text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {showAllUpdates ? "expand_less" : "expand_more"}
              </span>
              {showAllUpdates
                ? "Show less"
                : `Show ${conversationMessages.length - 3} more updates`}
            </button>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-on-surface/60"
            onClick={() => setPreviewImage(null)}
          />
          <div className="relative max-w-3xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={previewImage}
              alt="Attachment preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
