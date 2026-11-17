"use client";

import { CalendarCheck, DoorClosed, DoorOpen } from "lucide-react";
import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { RESERVATION_STATUS } from "@/types/hotel/catalogs";
import type { Reservation } from "@/types/hotel";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

interface Props {
  reservation: Reservation;
  actionLabel: string;
  actionKind: "checkin" | "checkout";
  loading: boolean;
  onAction: (reservation: Reservation) => void;
}

export function ReservationActionCard({
  reservation,
  actionLabel,
  actionKind,
  loading,
  onAction,
}: Props) {
  const meta = RESERVATION_STATUS[reservation.statusCode];
  const Icon = actionKind === "checkin" ? DoorOpen : DoorClosed;
  const buttonClass =
    actionKind === "checkin"
      ? "bg-primary hover:bg-primary/90"
      : "bg-amber-600 hover:bg-amber-700";

  return (
    <article className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Reserva
          </p>
          <p className="font-mono text-base font-bold text-gray-900">
            {reservation.code}
          </p>
          <p className="mt-1 text-sm text-gray-700">{reservation.guestFullName}</p>
        </div>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info label="Check-in prev.">
          {dateTime.format(new Date(reservation.checkInPlanned))}
        </Info>
        <Info label="Check-out prev.">
          {dateTime.format(new Date(reservation.checkOutPlanned))}
        </Info>
        <Info label="Quartos">{reservation.rooms.length}</Info>
        <Info label="Saldo">
          <span
            className={
              reservation.remainingAmount > 0
                ? "text-rose-600"
                : "text-emerald-600"
            }
          >
            {currency.format(reservation.remainingAmount)}
          </span>
        </Info>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400">
          <CalendarCheck size={12} className="mr-1 inline" />
          {reservation.adults} adulto(s)
          {reservation.children > 0 ? ` · ${reservation.children} criança(s)` : ""}
        </p>
        <button
          type="button"
          onClick={() => onAction(reservation)}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${buttonClass}`}
        >
          <Icon size={16} />
          {loading ? "A processar..." : actionLabel}
        </button>
      </div>
    </article>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-2.5 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-gray-800">{children}</p>
    </div>
  );
}