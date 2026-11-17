"use client";

import type { ReactNode } from "react";

interface HotelSuperAdminHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  actions?: ReactNode;
  statLabel?: string;
  statValue?: number | string;
}

export function HotelSuperAdminHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  statLabel,
  statValue,
}: HotelSuperAdminHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500 p-3 text-white">{icon}</div>

            <div>
              <p className="text-sm font-medium text-cyan-300">{eyebrow}</p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {title}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            {description}
          </p>

          {statValue !== undefined && statLabel && (
            <div className="mt-6 inline-flex rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {statLabel}
                </p>
                <p className="text-2xl font-bold text-white">{statValue}</p>
              </div>
            </div>
          )}
        </div>

        {actions && (
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}