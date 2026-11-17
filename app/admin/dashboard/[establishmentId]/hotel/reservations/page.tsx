"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListReservations } from "@/hooks/hotel/reservations/useListReservations";

import { StatusBadge } from "@/components/hotel/shared/StatusBadge";

import { RESERVATION_STATUS } from "@/types/hotel/catalogs";
import type { ReservationStatusCode } from "@/types/hotel";
import { HotelReservationCreateModal } from "@/components/hotel/reservations/HotelReservationCreateModal";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

const FILTERS: Array<{ value: "" | ReservationStatusCode; label: string }> = [
  { value: "", label: "Todas" },
  { value: "PENDING", label: "Pendentes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "CHECKED_IN", label: "Check-in" },
  { value: "CHECKED_OUT", label: "Check-out" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "NO_SHOW", label: "No-show" },
];

export default function HotelReservationsPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const router = useRouter();

  const { data: reservations, loading, error, fetch: loadReservations } =
    useListReservations();

  const [statusFilter, setStatusFilter] = useState<"" | ReservationStatusCode>("");
  const [term, setTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    await loadReservations(establishmentId);
  }, [establishmentId, loadReservations]);

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const normalizedTerm = term.trim().toLowerCase();
    return reservations.filter((r) => {
      if (statusFilter && r.statusCode !== statusFilter) return false;
      if (!normalizedTerm) return true;
      return (
        r.code.toLowerCase().includes(normalizedTerm) ||
        r.guestFullName.toLowerCase().includes(normalizedTerm)
      );
    });
  }, [reservations, statusFilter, term]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <CalendarCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Reservas</h1>
              <p className="text-sm text-gray-500">
                {reservations.length} reserva(s) registada(s)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Plus size={16} />
              Nova reserva
            </button>
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

        {/* Pesquisa + filtros */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Pesquisar por código ou hóspede…"
              className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            {FILTERS.map((f) => {
              const active = statusFilter === f.value;
              return (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setStatusFilter(f.value)}
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
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && reservations.length === 0 ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <CalendarCheck size={22} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Sem reservas
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Ajuste os filtros ou crie uma nova reserva.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-borderLight bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Hóspede</th>
                <th className="px-4 py-3">Check-in prev.</th>
                <th className="px-4 py-3">Check-out prev.</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const meta = RESERVATION_STATUS[r.statusCode];
                return (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                      {r.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {r.guestFullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {dateTime.format(new Date(r.checkInPlanned))}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {dateTime.format(new Date(r.checkOutPlanned))}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {currency.format(r.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/dashboard/${establishmentId}/hotel/reservations/${r.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Ver detalhe
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <HotelReservationCreateModal
  open={createOpen}
  establishmentId={establishmentId}
  role="admin" 

  onClose={() => setCreateOpen(false)}
  onCreated={async (reservationId) => {
    setCreateOpen(false);
    await load();
    router.push(
      `/admin/dashboard/${establishmentId}/hotel/reservations/${reservationId}`,
    );
  }}
/>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}