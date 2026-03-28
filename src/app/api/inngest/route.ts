import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { processMessage } from "@/lib/inngest/functions/process-message";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processMessage],
});
