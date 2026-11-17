"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  DoorClosed,
  DoorOpen,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useFindReservationById } from "@/hooks/hotel/reservations/useFindReservationById";
import { useConfirmReservation } from "@/hooks/hotel/reservations/useConfirmReservation";
import { useCancelReservation } from "@/hooks/hotel/reservations/useCancelReservation";
import { useCheckIn } from "@/hooks/hotel/checkin/useCheckIn";
import { useCheckOut } from "@/hooks/hotel/checkout/useCheckOut";
import { HotelReservationCompanionsModal } from "@/components/hotel/reservations/HotelReservationCompanionsModal";
import { UserCog } from "lucide-react"; // ou Users
import { useState } from "react";

import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { useToast } from "@/ context/ToastContext";

import { RESERVATION_STATUS } from "@/types/hotel/catalogs";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function HotelReservationDetailPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string; reservationId: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [companionsModalOpen, setCompanionsModalOpen] = useState(false);

  const { data, loading, error, fetch } = useFindReservationById();
  const confirm = useConfirmReservation();
  const cancel = useCancelReservation();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const load = useCallback(async () => {
    await fetch(params.establishmentId, params.reservationId);
  }, [fetch, params.establishmentId, params.reservationId]);

  useEffect(() => {
    void load();
  }, []);

  async function runAction(
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    try {
      await action();
      showToast(successMessage, "success");
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha na operação.", "error");
    }
  }

  if (loading && !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link
          href={`/admin/dashboard/${params.establishmentId}/hotel/reservations`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Voltar para reservas
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error ?? "Reserva não encontrada."}
        </div>
      </div>
    );
  }

  const meta = RESERVATION_STATUS[data.statusCode];
  const canConfirm = data.statusCode === "PENDING";
  const canCancel =
    data.statusCode === "PENDING" || data.statusCode === "CONFIRMED";
  const canCheckIn = data.statusCode === "CONFIRMED";
  const canCheckOut = data.statusCode === "CHECKED_IN";

  return (
    <div className="space-y-6 animate-fadeIn">
      <Link
        href={`/admin/dashboard/${params.establishmentId}/hotel/reservations`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar para reservas
      </Link>

      {/* Cabeçalho */}
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Reserva
            </p>
            <h1 className="font-mono text-2xl font-bold text-gray-900">
              {data.code}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{data.guestFullName}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge label={meta.label} tone={meta.tone} />
              <span className="text-xs text-gray-500">
                {data.adults} adulto(s)
                {data.children > 0 ? ` · ${data.children} criança(s)` : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canConfirm && (
              <button
                type="button"
                onClick={() =>
                  runAction(
                    () => confirm.confirm(params.establishmentId, data.id),
                    "Reserva confirmada.",
                  )
                }
                disabled={confirm.loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                Confirmar
              </button>
            )}
            {canCheckIn && (
              <button
                type="button"
                onClick={() =>
                  runAction(
                    () =>
                      checkIn.execute(params.establishmentId, {
                        reservationId: data.id,
                      }),
                    "Check-in realizado.",
                  )
                }
                disabled={checkIn.loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                <DoorOpen size={16} />
                Check-in
              </button>
            )}
            {canCheckOut && (
              <button
                type="button"
                onClick={() =>
                  runAction(
                    () =>
                      checkOut.execute(params.establishmentId, {
                        reservationId: data.id,
                      }),
                    "Check-out realizado.",
                  )
                }
                disabled={checkOut.loading}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                <DoorClosed size={16} />
                Check-out
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                onClick={() =>
                  runAction(
                    () => cancel.cancel(params.establishmentId, data.id),
                    "Reserva cancelada.",
                  )
                }
                disabled={cancel.loading}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                <XCircle size={16} />
                Cancelar
              </button>
            )}
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

        {/* Resumo financeiro + datas */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Summary label="Check-in previsto">
            {dateTime.format(new Date(data.checkInPlanned))}
          </Summary>
          <Summary label="Check-out previsto">
            {dateTime.format(new Date(data.checkOutPlanned))}
          </Summary>
          <Summary label="Check-in real">
            {data.actualCheckIn
              ? dateTime.format(new Date(data.actualCheckIn))
              : "—"}
          </Summary>
          <Summary label="Check-out real">
            {data.actualCheckOut
              ? dateTime.format(new Date(data.actualCheckOut))
              : "—"}
          </Summary>

          <Summary label="Total">{currency.format(data.totalAmount)}</Summary>
          <Summary label="Pago">{currency.format(data.paidAmount)}</Summary>
          <Summary label="Saldo pendente">
            <span
              className={
                data.remainingAmount > 0 ? "text-rose-600" : "text-emerald-600"
              }
            >
              {currency.format(data.remainingAmount)}
            </span>
          </Summary>
          <Summary label="Notas">{data.notes ?? "—"}</Summary>
        </div>
      </section>

      {/* Quartos + acompanhantes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Quartos" icon={<BedDouble size={18} />}>
          {data.rooms.length === 0 ? (
            <EmptyHint message="Sem quartos associados." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.rooms.map((room) => (
                <li key={room.id} className="py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Nº {room.roomNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {room.periodCount} × {room.periodUnitCode} ·{" "}
                        {dateTime.format(new Date(room.fromDate))} →{" "}
                        {dateTime.format(new Date(room.toDate))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {currency.format(room.subtotal)}
                      </p>
                      {room.extraCharge > 0 && (
                        <p className="text-xs text-amber-600">
                          + {currency.format(room.extraCharge)} extra
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

       <Card 
          title="Acompanhantes" 
          icon={<Users size={18} />}
          action={
            <button 
              onClick={() => setCompanionsModalOpen(true)}
              className="text-primary hover:underline text-xs font-semibold flex items-center gap-1"
            >
              <UserCog size={14} /> Gerir
            </button>
          }
        >
          {data.companions.length === 0 ? (
            <EmptyHint message="Sem acompanhantes." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.companions.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-medium text-gray-900">
                    {c.guestFullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {c.relationship ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

    <HotelReservationCompanionsModal
  open={companionsModalOpen}
  establishmentId={params.establishmentId}
  reservation={data}
  onClose={() => setCompanionsModalOpen(false)}
  onUpdated={(updatedReservation) => {
    // Atualiza o estado local da reserva imediatamente sem fazer fetch
    // (se o useFindReservationById tiver um setData, usas esse; senão, faz fetch de novo)
    fetch(params.establishmentId, params.reservationId); 
  }}
/>
    </div>
  );
}

function Summary({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{children}</p>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-gray-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">{icon}</div>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return <p className="py-4 text-center text-sm text-gray-400">{message}</p>;
}