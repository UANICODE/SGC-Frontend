"use client";

import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BedDouble,
  CalendarCheck,
  DoorOpen,
  DoorClosed,
  TrendingUp,
  Wallet,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useDashboardOverview } from "@/hooks/hotel/dashboard/useDashboardOverview";
import { useReservationsByStatus } from "@/hooks/hotel/dashboard/useReservationsByStatus";
import { useRecentReservations } from "@/hooks/hotel/dashboard/useRecentReservations";
import { useOpenCashSessions } from "@/hooks/hotel/dashboard/useOpenCashSessions";
import { useRecentMovements } from "@/hooks/hotel/dashboard/useRecentMovements";

import { RESERVATION_STATUS } from "@/types/hotel/catalogs";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function HotelDashboardPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;

  const overview = useDashboardOverview();
  const byStatus = useReservationsByStatus();
  const recentReservations = useRecentReservations();
  const openCashSessions = useOpenCashSessions();
  const recentMovements = useRecentMovements();

  const load = useCallback(async () => {
    await Promise.all([
      overview.fetch(establishmentId),
      byStatus.fetch(establishmentId),
      recentReservations.fetch(establishmentId, 5),
      openCashSessions.fetch(establishmentId),
      recentMovements.fetch(establishmentId, 5),
    ]);
  }, [
    establishmentId,
    overview,
    byStatus,
    recentReservations,
    openCashSessions,
    recentMovements,
  ]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentId]);

  const basePath = `/admin/dashboard/${establishmentId}/hotel`;
  const data = overview.data;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho */}
      <section className="rounded-2xl bg-white border border-borderLight p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <BedDouble size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">
                Painel do Hotel
              </h1>
              <p className="text-sm text-gray-500">
                Visão operacional em tempo real.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={overview.loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={overview.loading ? "animate-spin" : ""}
            />
            Atualizar
          </button>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Receita de hoje"
          value={data ? currency.format(data.todayRevenue) : "—"}
          icon={<TrendingUp size={18} />}
          tone="emerald"
          loading={overview.loading}
        />
        <KpiCard
          title="Check-ins de hoje"
          value={data ? String(data.todayCheckIns) : "—"}
          icon={<DoorOpen size={18} />}
          tone="cyan"
          loading={overview.loading}
        />
        <KpiCard
          title="Check-outs de hoje"
          value={data ? String(data.todayCheckOuts) : "—"}
          icon={<DoorClosed size={18} />}
          tone="amber"
          loading={overview.loading}
        />
        <KpiCard
          title="Caixas abertos"
          value={data ? String(data.openCashSessions) : "—"}
          icon={<Wallet size={18} />}
          tone="rose"
          loading={overview.loading}
        />
      </section>

      {/* Ocupação + reservas por estado */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="Ocupação atual"
          icon={<BedDouble size={18} />}
          actionHref={`${basePath}/rooms`}
          actionLabel="Ver quartos"
        >
          {!data ? (
            <SkeletonBlock />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SmallStat label="Total" value={data.occupancy.totalRooms} />
                <SmallStat
                  label="Ocupados"
                  value={data.occupancy.occupiedRooms}
                  tone="cyan"
                />
                <SmallStat
                  label="Disponíveis"
                  value={data.occupancy.availableRooms}
                  tone="emerald"
                />
                <SmallStat
                  label="Sujos"
                  value={data.occupancy.dirtyRooms}
                  tone="amber"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                  <span>Taxa de ocupação</span>
                  <span className="font-semibold text-gray-700">
                    {(data.occupancy.occupancyRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.min(100, data.occupancy.occupancyRate * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card
          title="Reservas por estado"
          icon={<CalendarCheck size={18} />}
          actionHref={`${basePath}/reservations`}
          actionLabel="Ver reservas"
        >
          {byStatus.loading && byStatus.data.length === 0 ? (
            <SkeletonBlock />
          ) : byStatus.data.length === 0 ? (
            <EmptyHint message="Sem reservas registadas." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {byStatus.data.map((item) => {
                const meta =
                  RESERVATION_STATUS[
                    item.statusCode as keyof typeof RESERVATION_STATUS
                  ];
                return (
                  <li
                    key={item.statusCode}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <span className="text-gray-700">
                      {meta?.label ?? item.statusName}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.total}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>

      {/* Últimas reservas + caixas abertos + movimentos */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="Últimas reservas"
          icon={<CalendarCheck size={18} />}
          actionHref={`${basePath}/reservations`}
          actionLabel="Ver todas"
        >
          {recentReservations.loading && recentReservations.data.length === 0 ? (
            <SkeletonBlock />
          ) : recentReservations.data.length === 0 ? (
            <EmptyHint message="Sem reservas recentes." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentReservations.data.map((r) => (
                <li key={r.id} className="py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-gray-500">{r.code}</p>
                      <p className="text-sm font-medium text-gray-800">
                        {r.guestName}
                      </p>
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

        <div className="grid grid-cols-1 gap-4">
          <Card
            title="Caixas abertos"
            icon={<Wallet size={18} />}
            actionHref={`${basePath}/cash`}
            actionLabel="Ver caixa"
          >
            {openCashSessions.loading && openCashSessions.data.length === 0 ? (
              <SkeletonBlock />
            ) : openCashSessions.data.length === 0 ? (
              <EmptyHint message="Nenhum caixa aberto." />
            ) : (
              <ul className="divide-y divide-gray-100">
                {openCashSessions.data.map((c) => (
                  <li
                    key={c.sessionId}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{c.openedByName}</p>
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

          <Card
            title="Últimos movimentos"
            icon={<Sparkles size={18} />}
            actionHref={`${basePath}/cash`}
            actionLabel="Ver caixa"
          >
            {recentMovements.loading && recentMovements.data.length === 0 ? (
              <SkeletonBlock />
            ) : recentMovements.data.length === 0 ? (
              <EmptyHint message="Sem movimentos recentes." />
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentMovements.data.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {m.movementTypeName}
                      </p>
                      <p className="text-xs text-gray-500">{m.registeredByName}</p>
                    </div>
                    <span
                      className={`font-semibold ${
                        m.isInflow ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {m.isInflow ? "+" : "-"}
                      {currency.format(m.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

/* ------------- Subcomponentes locais ------------- */

type Tone = "primary" | "emerald" | "cyan" | "amber" | "rose";

const TONE_BG: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-50 text-emerald-600",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

function KpiCard({
  title,
  value,
  icon,
  tone,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone: Tone;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 ${TONE_BG[tone]}`}>{icon}</div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-500">
            {title}
          </p>
          <p className="mt-1 truncate text-xl font-bold text-gray-900">
            {loading ? "…" : value}
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  actionHref: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">{icon}</div>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {actionLabel}
          <ArrowRight size={12} />
        </Link>
      </div>
      {children}
    </div>
  );
}

function SmallStat({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${TONE_BG[tone].split(" ")[1]}`}>
        {value}
      </p>
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return (
    <p className="py-4 text-center text-sm text-gray-400">{message}</p>
  );
}