"use client";

import { useRef, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addNoteAction } from "@/app/(dashboard)/cases/actions";

interface AddNoteFormProps {
  caseId: string;
}

export function AddNoteForm({ caseId }: AddNoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const note = formData.get("note") as string;
    if (!note.trim()) return;

    startTransition(async () => {
      await addNoteAction(caseId, note.trim());
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="note"
        placeholder="Add a note to this case..."
        rows={3}
      />
      <Button type="submit" size="sm" loading={isPending}>
        Add Note
      </Button>
    </form>
  );
}
