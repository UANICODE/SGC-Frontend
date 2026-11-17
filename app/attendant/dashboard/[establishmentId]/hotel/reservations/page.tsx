"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  DoorClosed,
  DoorOpen,
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListReservations } from "@/hooks/hotel/reservations/useListReservations";
import { useCheckIn } from "@/hooks/hotel/checkin/useCheckIn";
import { useCheckOut } from "@/hooks/hotel/checkout/useCheckOut";

import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { ConfirmDialog } from "@/components/hotel/shared/ConfirmDialog";
import { RESERVATION_STATUS } from "@/types/hotel/catalogs";
import type { Reservation, ReservationStatusCode } from "@/types/hotel";
import { useToast } from "@/ context/ToastContext";
import { HotelReservationCreateModal } from "@/components/hotel/reservations/HotelReservationCreateModal";
import { useConfirmReservation } from "@/hooks/hotel/reservations/useConfirmReservation";
import { useCancelReservation } from "@/hooks/hotel/reservations/useCancelReservation";

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
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "CHECKED_IN", label: "Em estadia" },
  { value: "PENDING", label: "Pendentes" },
];

type Action = "checkin" | "checkout";

export default function AttendantReservationsPage() {
  useHotelRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();

  const { data: reservations, loading, error, fetch } = useListReservations();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const router = useRouter();

const [createOpen, setCreateOpen] = useState(false);

  const [filter, setFilter] = useState<"" | ReservationStatusCode>("");
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [term, setTerm] = useState("");
  const [action, setAction] = useState<{ kind: Action; target: Reservation } | null>(
    null,
  );

  const load = useCallback(async () => {
    await fetch(establishmentId);
  }, [fetch, establishmentId]);

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const normalized = term.trim().toLowerCase();
    return reservations
      .filter((r) => (filter ? r.statusCode === filter : true))
      .filter((r) => {
        if (!normalized) return true;
        return (
          r.code.toLowerCase().includes(normalized) ||
          r.guestFullName.toLowerCase().includes(normalized)
        );
      });
  }, [reservations, filter, term]);




  async function handleAction() {
    if (!action) return;
    try {
      if (action.kind === "checkin") {
        await checkIn.execute(establishmentId, {
          reservationId: action.target.id,
        });
        showToast("Check-in realizado.", "success");
      } else {
        await checkOut.execute(establishmentId, {
          reservationId: action.target.id,
        });
        showToast("Check-out realizado.", "success");
      }
      setAction(null);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha na operação.", "error");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
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

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
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
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && reservations.length === 0 ? (
        <Skeleton />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">Nenhuma reserva encontrada.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-borderLight bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Hóspede</th>
                <th className="px-4 py-3">Check-in</th>
                <th className="px-4 py-3">Check-out</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const meta = RESERVATION_STATUS[r.statusCode];
                const canCheckIn = r.statusCode === "CONFIRMED";
                const canCheckOut = r.statusCode === "CHECKED_IN";
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
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {canCheckIn && (
                          <button
                            type="button"
                            onClick={() =>
                              setAction({ kind: "checkin", target: r })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                          >
                            <DoorOpen size={14} />
                            Check-in
                          </button>
                        )}
                        {canCheckOut && (
                          <button
                            type="button"
                            onClick={() =>
                              setAction({ kind: "checkout", target: r })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                          >
                            <DoorClosed size={14} />
                            Check-out
                          </button>
                        )}
                        <Link
                          href={`/attendant/dashboard/${establishmentId}/hotel/reservations/${r.id}`}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Detalhe
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!action}
        title={
          action?.kind === "checkin"
            ? "Confirmar check-in"
            : "Confirmar check-out"
        }
        description={`Hóspede: ${action?.target.guestFullName ?? ""}.`}
        confirmLabel={
          action?.kind === "checkin" ? "Confirmar check-in" : "Confirmar check-out"
        }
        tone="primary"
        loading={checkIn.loading || checkOut.loading}
        onConfirm={handleAction}
        onClose={() => setAction(null)}
      />

      <HotelReservationCreateModal
  open={createOpen}
  establishmentId={establishmentId}
  role="attendant"
  onClose={() => setCreateOpen(false)}
  onCreated={async (reservationId) => {
    setCreateOpen(false);
    await load();
    router.push(
      `/attendant/dashboard/${establishmentId}/hotel/reservations/${reservationId}`,
    );
  }}
/>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}