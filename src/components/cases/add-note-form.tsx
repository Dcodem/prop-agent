"use client";

import { useTransition, useRef } from "react";
import { addNoteAction } from "@/app/(dashboard)/cases/actions";

export function AddNoteForm({ caseId }: { caseId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const note = formData.get("note") as string;
    if (!note?.trim()) return;

    startTransition(async () => {
      await addNoteAction(caseId, note.trim());
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <label className="text-xs font-black text-on-surface-variant uppercase tracking-wider mb-3 block">
        Add a Note
      </label>
      <div className="flex gap-4">
        <input
          name="note"
          type="text"
          placeholder="Add a note to the timeline..."
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
  );
}
