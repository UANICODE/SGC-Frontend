"use client";

import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}