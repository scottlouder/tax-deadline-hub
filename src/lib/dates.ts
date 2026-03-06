export const formatDate = (isoDate: string | null) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate + "T00:00:00Z");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const daysUntil = (isoDate: string | null) => {
  if (!isoDate) return null;
  const now = new Date();
  const target = new Date(isoDate + "T00:00:00");
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const urgencyLabel = (days: number | null) => {
  if (days === null) return "N/A";
  if (days < 0) return "Passed";
  if (days <= 7) return "Urgent";
  if (days <= 30) return "Soon";
  return "On Track";
};

export const urgencyClass = (days: number | null) => {
  if (days === null) return "bg-slate-100 text-slate-700";
  if (days < 0) return "bg-slate-100 text-slate-700";
  if (days <= 7) return "bg-red-100 text-red-700";
  if (days <= 30) return "bg-orange-100 text-orange-700";
  return "bg-emerald-100 text-emerald-700";
};
