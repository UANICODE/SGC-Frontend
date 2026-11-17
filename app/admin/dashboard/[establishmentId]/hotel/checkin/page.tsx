"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { DoorOpen, RefreshCw, Search } from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListReservations } from "@/hooks/hotel/reservations/useListReservations";
import { useCheckIn } from "@/hooks/hotel/checkin/useCheckIn";

import { ReservationActionCard } from "@/components/hotel/checkin/ReservationActionCard";
import { ConfirmDialog } from "@/components/hotel/shared/ConfirmDialog";
import { useToast } from "@/ context/ToastContext";

import type { Reservation } from "@/types/hotel";

export default function HotelCheckInPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();

  const { data: reservations, loading, error, fetch } = useListReservations();
  const { execute: executeCheckIn, loading: submitting } = useCheckIn();

  const [term, setTerm] = useState("");
  const [target, setTarget] = useState<Reservation | null>(null);

  const load = useCallback(async () => {
    await fetch(establishmentId);
  }, [fetch, establishmentId]);

  useEffect(() => {
    void load();
  }, []);

  // Apenas reservas confirmadas podem fazer check-in
  const eligible = useMemo(() => {
    const normalized = term.trim().toLowerCase();
    return reservations
      .filter((r) => r.statusCode === "CONFIRMED")
      .filter((r) => {
        if (!normalized) return true;
        return (
          r.code.toLowerCase().includes(normalized) ||
          r.guestFullName.toLowerCase().includes(normalized)
        );
      });
  }, [reservations, term]);

  async function handleConfirm() {
    if (!target) return;
    try {
      await executeCheckIn(establishmentId, { reservationId: target.id });
      showToast("Check-in realizado.", "success");
      setTarget(null);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha no check-in.", "error");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <DoorOpen size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Check-in</h1>
              <p className="text-sm text-gray-500">
                Reservas confirmadas prontas para entrada
              </p>
            </div>
          </div>
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

        <div className="mt-5 relative">
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

        <p className="mt-3 text-xs text-gray-500">
          {eligible.length} reserva(s) elegível(is) para check-in
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && reservations.length === 0 ? (
        <SkeletonGrid />
      ) : eligible.length === 0 ? (
        <EmptyState message="Nenhuma reserva confirmada encontrada." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {eligible.map((r) => (
            <ReservationActionCard
              key={r.id}
              reservation={r}
              actionLabel="Fazer check-in"
              actionKind="checkin"
              loading={submitting && target?.id === r.id}
              onAction={(reservation) => setTarget(reservation)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Confirmar check-in"
        description={`Confirma a entrada do hóspede ${target?.guestFullName ?? ""}?`}
        confirmLabel="Confirmar check-in"
        cancelLabel="Voltar"
        tone="primary"
        loading={submitting}
        onConfirm={handleConfirm}
        onClose={() => setTarget(null)}
      />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <DoorOpen size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{message}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Confirme reservas na lista de reservas antes de fazer check-in.
      </p>
    </div>
  );
}