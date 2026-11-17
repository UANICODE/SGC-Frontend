"use client";

import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  DoorClosed,
  DoorOpen,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useDashboardOverview } from "@/hooks/hotel/dashboard/useDashboardOverview";
import { useOpenCashSessions } from "@/hooks/hotel/dashboard/useOpenCashSessions";
import { useRecentReservations } from "@/hooks/hotel/dashboard/useRecentReservations";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AttendantReceptionPage() {
  useHotelRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;

  const overview = useDashboardOverview();
  const openCash = useOpenCashSessions();
  const recent = useRecentReservations();

  const load = useCallback(async () => {
    await Promise.all([
      overview.fetch(establishmentId),
      openCash.fetch(establishmentId),
      recent.fetch(establishmentId, 5),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentId]);

  useEffect(() => {
    void load();
  }, []);

  const base = `/attendant/dashboard/${establishmentId}/hotel`;
  const data = overview.data;

  const quickActions = [
    {
      label: "Check-in",
      href: `${base}/checkin`,
      icon: <DoorOpen size={18} />,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Check-out",
      href: `${base}/checkout`,
      icon: <DoorClosed size={18} />,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Nova reserva",
      href: `${base}/reservations`,
      icon: <CalendarCheck size={18} />,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Caixa",
      href: `${base}/cash`,
      icon: <Wallet size={18} />,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho */}
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <BedDouble size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Recepção</h1>
              <p className="text-sm text-gray-500">
                Operações do turno atual.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={overview.loading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={overview.loading ? "animate-spin" : ""}
            />
            Atualizar
          </button>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Receita hoje" value={data ? currency.format(data.todayRevenue) : "—"} />
        <Kpi label="Check-ins" value={data ? String(data.todayCheckIns) : "—"} />
        <Kpi label="Check-outs" value={data ? String(data.todayCheckOuts) : "—"} />
        <Kpi label="Caixas abertos" value={data ? String(data.openCashSessions) : "—"} />
      </section>

      {/* Ações rápidas */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          Ações rápidas
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex flex-col items-start gap-3 rounded-2xl border border-borderLight bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className={`rounded-xl p-2 ${a.tone}`}>{a.icon}</div>
              <span className="text-sm font-medium text-gray-900">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Caixa aberto + últimas reservas */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Caixa aberto" href={`${base}/cash`}>
          {openCash.loading && openCash.data.length === 0 ? (
            <Skeleton />
          ) : openCash.data.length === 0 ? (
            <EmptyHint message="Nenhum caixa aberto." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {openCash.data.map((c) => (
                <li
                  key={c.sessionId}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{c.openedByName}</p>
                    <p className="text-xs text-gray-500">
                      {dateTime.format(new Date(c.openedAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Saldo</p>
                    <p className="font-semibold text-gray-900">
                      {currency.format(
                        c.openingBalance + c.currentTotalIn - c.currentTotalOut,
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Últimas reservas" href={`${base}/reservations`}>
          {recent.loading && recent.data.length === 0 ? (
            <Skeleton />
          ) : recent.data.length === 0 ? (
            <EmptyHint message="Sem reservas recentes." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.data.map((r) => (
                <li key={r.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-gray-500">{r.code}</p>
                      <p className="font-medium text-gray-900">{r.guestName}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {dateTime.format(new Date(r.createdAt))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-borderLight bg-white p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Card({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Ver
          <ArrowRight size={12} />
        </Link>
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return <p className="py-4 text-center text-sm text-gray-400">{message}</p>;
}