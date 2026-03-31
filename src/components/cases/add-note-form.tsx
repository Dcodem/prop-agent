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
      <label className="text-xs font-black text-[#3e494a] uppercase tracking-wider mb-3 block">
        Add a Note
      </label>
      <div className="flex gap-4">
        <input
          name="note"
          type="text"
          placeholder="Add a note to the timeline..."
          className="flex-grow bg-[#eff4ff] border border-[#bdc9ca]/20 rounded-lg px-5 py-3 text-sm focus:ring-2 focus:ring-[#006872]/40 focus:border-[#006872] transition-all placeholder:text-[#3e494a]/40"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#006872] text-white px-6 py-3 rounded-lg font-black text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {isPending ? "Adding..." : "Add Note"}
        </button>
      </div>
    </form>
  );
}
