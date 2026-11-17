"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  CheckCircle2,
  DoorClosed,
  DoorOpen,
  PlusCircle,
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

import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { ConfirmDialog } from "@/components/hotel/shared/ConfirmDialog";
import { HotelExtendStayModal } from "@/components/hotel/reservations/HotelExtendStayModal";

import { RESERVATION_STATUS } from "@/types/hotel/catalogs";
import { useToast } from "@/ context/ToastContext";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AttendantReservationDetailPage() {
  useHotelRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string; reservationId: string }>();
  const establishmentId = params.establishmentId;
  const reservationId = params.reservationId;
  const { showToast } = useToast();

  const { data, loading, error, fetch } = useFindReservationById();
  const confirm = useConfirmReservation();
  const cancel = useCancelReservation();
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);

  const load = useCallback(async () => {
    await fetch(establishmentId, reservationId);
  }, [fetch, establishmentId, reservationId]);

  useEffect(() => {
    void load();
  }, []);

  async function handleConfirm() {
    try {
      await confirm.confirm(establishmentId, reservationId, "attendant");
      showToast("Reserva confirmada.", "success");
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao confirmar.", "error");
    }
  }

  async function handleCancel() {
    try {
      await cancel.cancel(establishmentId, reservationId, "attendant");
      showToast("Reserva cancelada.", "success");
      setCancelOpen(false);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao cancelar.", "error");
    }
  }

  async function handleCheckIn() {
    try {
      await checkIn.execute(establishmentId, { reservationId });
      showToast("Check-in realizado.", "success");
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha no check-in.", "error");
    }
  }

  async function handleCheckOut() {
    try {
      await checkOut.execute(establishmentId, { reservationId });
      showToast("Check-out realizado.", "success");
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha no check-out.", "error");
    }
  }

  if (loading && !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Link
          href={`/attendant/dashboard/${establishmentId}/hotel/reservations`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error ?? "Reserva não encontrada."}
        </div>
      </div>
    );
  }

  const meta = RESERVATION_STATUS[data.statusCode];
  const isPending = data.statusCode === "PENDING";
  const isConfirmed = data.statusCode === "CONFIRMED";
  const isCheckedIn = data.statusCode === "CHECKED_IN";
  const canCancel = isPending || isConfirmed;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Link
        href={`/attendant/dashboard/${establishmentId}/hotel/reservations`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

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
            {isPending && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirm.loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                Confirmar
              </button>
            )}

            {isConfirmed && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={checkIn.loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                <DoorOpen size={16} />
                Check-in
              </button>
            )}

            {isCheckedIn && (
              <button
                type="button"
                onClick={handleCheckOut}
                disabled={checkOut.loading}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                <DoorClosed size={16} />
                Check-out
              </button>
            )}

            {isCheckedIn && (
              <button
                type="button"
                onClick={() => setExtendOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                <PlusCircle size={16} />
                Estender
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
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

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Sum label="Check-in previsto">
            {dateTime.format(new Date(data.checkInPlanned))}
          </Sum>
          <Sum label="Check-out previsto">
            {dateTime.format(new Date(data.checkOutPlanned))}
          </Sum>
          <Sum label="Total">{currency.format(data.totalAmount)}</Sum>
          <Sum label="Saldo pendente">
            <span
              className={
                data.remainingAmount > 0 ? "text-rose-600" : "text-emerald-600"
              }
            >
              {currency.format(data.remainingAmount)}
            </span>
          </Sum>
        </div>

        {isPending && (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
            Esta reserva está <strong>pendente</strong>. Confirme-a primeiro para
            poder fazer o check-in.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Quartos" icon={<BedDouble size={18} />}>
          {data.rooms.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              Sem quartos associados.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Nº {room.roomNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {room.periodCount} × {room.periodUnitCode}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {currency.format(room.subtotal)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Acompanhantes" icon={<Users size={18} />}>
          {data.companions.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">
              Sem acompanhantes.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.companions.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
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

      <ConfirmDialog
        open={cancelOpen}
        title="Cancelar reserva"
        description={`Tem a certeza que quer cancelar a reserva de ${data.guestFullName}? Esta ação não pode ser revertida.`}
        confirmLabel="Cancelar reserva"
        cancelLabel="Voltar"
        tone="danger"
        loading={cancel.loading}
        onConfirm={handleCancel}
        onClose={() => setCancelOpen(false)}
      />

     
      <HotelExtendStayModal
        open={extendOpen}
        establishmentId={establishmentId}
        reservation={data}
        role="attendant"
        onClose={() => setExtendOpen(false)}
        onExtended={load}
      />
    </div>
  );
}

function Sum({
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
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-gray-800">
        <div className="rounded-lg bg-primary/10 p-1.5 text-primary">{icon}</div>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}