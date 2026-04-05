export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatEnum(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate a one-sentence summary for a case based on the raw message and category.
 * Used in both the case table subject column and the case detail header.
 */
export function generateCaseSummary(rawMessage: string, category: string | null): string {
  const msg = rawMessage.toLowerCase();
  const cat = category ?? "general";

  const summaries: Record<string, () => string> = {
    maintenance: () => {
      if (msg.includes("sink") || msg.includes("leak")) return "Kitchen sink leak — water pooling under cabinet";
      if (msg.includes("ac") || msg.includes("hvac") || msg.includes("air")) return "AC unit blowing warm air — needs HVAC service";
      if (msg.includes("dishwasher")) return "Dishwasher malfunction — grinding noise, won't drain";
      if (msg.includes("ant") || msg.includes("pest")) return "Ant infestation in kitchen — recurring issue near baseboard";
      if (msg.includes("door") || msg.includes("lock")) return "Door lock jammed — tenant unable to secure unit";
      if (msg.includes("toilet") || msg.includes("plumb")) return "Plumbing issue — toilet running continuously";
      if (msg.includes("window")) return "Window not closing properly — draft and security concern";
      return rawMessage.length > 80 ? rawMessage.slice(0, 77) + "..." : rawMessage;
    },
    emergency: () => {
      if (msg.includes("electrical") || msg.includes("burning")) return "Electrical emergency — burning smell from outlet";
      if (msg.includes("lock")) return "Tenant lockout — needs emergency locksmith";
      if (msg.includes("flood") || msg.includes("water")) return "Water emergency — flooding in unit";
      if (msg.includes("fire") || msg.includes("smoke")) return "Fire/smoke emergency — immediate response needed";
      return rawMessage.length > 80 ? rawMessage.slice(0, 77) + "..." : rawMessage;
    },
    lease_question: () => "Lease renewal inquiry — requesting terms for extension",
    noise_complaint: () => {
      if (msg.includes("construction")) return "Early-morning construction noise — violates quiet hours";
      return "Noise complaint — repeated late-night disturbances";
    },
    payment: () => "Payment issue — rent transfer rejected by bank",
    general: () => rawMessage.length > 80 ? rawMessage.slice(0, 77) + "..." : rawMessage,
  };

  return (summaries[cat] ?? summaries.general)();
}
