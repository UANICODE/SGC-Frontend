"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  Lock,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListCashSessions } from "@/hooks/hotel/cash/useListCashSessions";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

type FilterValue = "" | "open" | "closed";

const FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: "", label: "Todos" },
  { value: "open", label: "Abertos" },
  { value: "closed", label: "Fechados" },
];

export default function HotelCashPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;

  const { data: sessions, loading, error, fetch } = useListCashSessions();

  const [filter, setFilter] = useState<FilterValue>("");

  const load = useCallback(async () => {
    await fetch(establishmentId);
  }, [fetch, establishmentId]);

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "open") return sessions.filter((s) => !s.closed);
    if (filter === "closed") return sessions.filter((s) => s.closed);
    return sessions;
  }, [sessions, filter]);

  const openCount = sessions.filter((s) => !s.closed).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Caixa</h1>
              <p className="text-sm text-gray-500">
                {sessions.length} sessão(ões) · {openCount} aberta(s)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
        </div>

      

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                  active
                    ? "bg-primary text-white ring-primary"
                    : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && sessions.length === 0 ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const balance = s.openingBalance + s.totalIn - s.totalOut;
            return (
              <article
                key={s.id}
                className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Caixa
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {s.openedByName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dateTime.format(new Date(s.openedAt))}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                      s.closed
                        ? "bg-slate-100 text-slate-700 ring-slate-200"
                        : "bg-emerald-100 text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    {s.closed ? (
                      <>
                        <CheckCircle2 size={12} /> Fechado
                      </>
                    ) : (
                      "Aberto"
                    )}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Mini label="Inicial">
                    {currency.format(s.openingBalance)}
                  </Mini>
                  <Mini label="Entradas" tone="emerald">
                    +{currency.format(s.totalIn)}
                  </Mini>
                  <Mini label="Saídas" tone="rose">
                    -{currency.format(s.totalOut)}
                  </Mini>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500">
                    Saldo
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {currency.format(balance)}
                  </p>
                </div>

                <Link
                  href={`/admin/dashboard/${establishmentId}/hotel/cash/${s.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Ver movimentos
                  <ArrowRight size={14} />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Mini({
  label,
  children,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  tone?: "emerald" | "rose";
}) {
  const color =
    tone === "emerald"
      ? "text-emerald-600"
      : tone === "rose"
        ? "text-rose-600"
        : "text-gray-900";
  return (
    <div className="rounded-lg bg-gray-50 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`mt-0.5 text-xs font-semibold ${color}`}>{children}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <Wallet size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Nenhum caixa
      </h3>
    
    </div>
  );
}