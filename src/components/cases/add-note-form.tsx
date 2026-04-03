"use client";

import { useState, useTransition, useRef } from "react";
import { addNoteAction } from "@/app/(dashboard)/cases/actions";

interface LocalNote {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  stage: string;
}

function formatStage(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AddNoteForm({ caseId, caseStatus = "open" }: { caseId: string; caseStatus?: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [localNotes, setLocalNotes] = useState<LocalNote[]>([]);

  function handleSubmit(formData: FormData) {
    const note = formData.get("note") as string;
    if (!note?.trim()) return;

    // Add to local display immediately
    setLocalNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        text: note.trim(),
        author: "Property Manager",
        timestamp: new Date(),
        stage: caseStatus,
      },
    ]);

    startTransition(async () => {
      await addNoteAction(caseId, note.trim());
      formRef.current?.reset();
    });
  }

  return (
    <div>
      <form ref={formRef} action={handleSubmit}>
        <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider mb-3 block">
          Add a Note
        </label>
        <div className="flex gap-4">
          <input
            name="note"
            type="text"
            placeholder="Write a note..."
            className="flex-grow bg-primary-fixed border border-outline-variant/20 rounded-lg px-5 py-3 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-black text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            {isPending ? "Adding..." : "Add Note"}
          </button>
        </div>
      </form>

      {/* Notes appear below the form, oldest first */}
      {localNotes.length > 0 && (
        <div className="space-y-3 mt-6">
          {localNotes.map((note) => (
            <div
              key={note.id}
              className="bg-primary-fixed/50 border border-primary/10 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">{note.author}</span>
                  <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wider">
                    {formatStage(note.stage)}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  {note.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  &bull;{" "}
                  {note.timestamp.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-on-surface leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
