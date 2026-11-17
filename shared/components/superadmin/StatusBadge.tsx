"use client";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const TONES: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-100 text-amber-700 ring-amber-200",
  danger: "bg-rose-100 text-rose-700 ring-rose-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  info: "bg-cyan-100 text-cyan-700 ring-cyan-200",
};

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
}

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${TONES[tone]}`}
    >
      {label}
    </span>
  );
}