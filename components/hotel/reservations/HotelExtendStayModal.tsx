"use client";

import { useMemo, useState } from "react";
import { Clock, X } from "lucide-react";

import { useExtendStay } from "@/hooks/hotel/checkin/useExtendStay";
import { useToast } from "@/ context/ToastContext";
import type {
  HotelApiRole,
  Reservation,
  ReservationRoom,
  StayPeriodUnitCode,
} from "@/types/hotel";
import { STAY_PERIOD_UNIT } from "@/types/hotel/catalogs";

interface Props {
  open: boolean;
  establishmentId: string;
  reservation: Reservation;
  role: HotelApiRole;
  onClose: () => void;
  onExtended: () => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

function previewExtension(
  room: ReservationRoom,
  count: number,
  unit: StayPeriodUnitCode,
): number | null {
  // 👇 HOURS usa hourPrice
  if (unit === "HOURS") {
    if (room.hourPrice == null) return null;
    return room.hourPrice * count;
  }

  if (room.nightPrice == null) return null;
  const days =
    unit === "DAYS"
      ? count
      : unit === "WEEKS"
        ? count * 7
        : unit === "MONTHS"
          ? count * 30
          : count * 365;
  return room.nightPrice * days;
}

export function HotelExtendStayModal({
  open,
  establishmentId,
  reservation,
  role,
  onClose,
  onExtended,
}: Props) {
  const { showToast } = useToast();
  const { execute, loading } = useExtendStay();

  const [reservationRoomId, setReservationRoomId] = useState(
    reservation.rooms[0]?.id ?? "",
  );
  const [additionalPeriodCount, setAdditionalPeriodCount] = useState("1");
  const [periodUnitCode, setPeriodUnitCode] =
    useState<StayPeriodUnitCode>("DAYS");
  const [reason, setReason] = useState("");

  const selectedRoom = useMemo(
    () => reservation.rooms.find((r) => r.id === reservationRoomId),
    [reservation.rooms, reservationRoomId],
  );

  const preview = useMemo(() => {
    if (!selectedRoom) return null;
    const count = Number(additionalPeriodCount);
    if (!Number.isFinite(count) || count < 1) return null;
    return previewExtension(selectedRoom, count, periodUnitCode);
  }, [selectedRoom, additionalPeriodCount, periodUnitCode]);

  if (!open) return null;

  async function handleSubmit() {
    const count = Number(additionalPeriodCount);

    if (!reservationRoomId) {
      showToast("Selecione o quarto a estender.", "error");
      return;
    }
    if (!Number.isFinite(count) || count < 1) {
      showToast("O período adicional deve ser no mínimo 1.", "error");
      return;
    }

    try {
      await execute(
        establishmentId,
        {
          reservationRoomId,
          additionalPeriodCount: count,
          periodUnitCode,
          reason: reason.trim() || undefined,
        },
        role,
      );

      showToast("Estadia estendida com sucesso.", "success");
      setAdditionalPeriodCount("1");
      setPeriodUnitCode("DAYS");
      setReason("");
      onClose();
      await onExtended();
    } catch (err: any) {
      showToast(err?.message || "Falha ao estender estadia.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Clock size={18} className="text-primary" />
            Estender Estadia
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Quarto da reserva
            </label>
            <select
              value={reservationRoomId}
              onChange={(e) => setReservationRoomId(e.target.value)}
              className={inputClass}
            >
              {reservation.rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Nº {room.roomNumber} · check-out atual:{" "}
                  {new Date(room.toDate).toLocaleString("pt-PT")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Período adicional
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="number"
                min="1"
                value={additionalPeriodCount}
                onChange={(e) => setAdditionalPeriodCount(e.target.value)}
                className="w-24 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <select
                value={periodUnitCode}
                onChange={(e) =>
                  setPeriodUnitCode(e.target.value as StayPeriodUnitCode)
                }
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {Object.entries(STAY_PERIOD_UNIT).map(([code, meta]) => (
                  <option key={code} value={code}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
            {preview !== null ? (
              <p className="mt-1 text-xs font-medium text-emerald-700">
                Custo estimado: {currency.format(preview)}
              </p>
            ) : (
              <p className="mt-1 text-xs text-rose-600">
                Este quarto não aceita a unidade escolhida.
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Motivo (opcional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Ex: pedido do hóspede, voo cancelado..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || preview === null}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "A processar..." : "Estender"}
          </button>
        </div>
      </div>
    </div>
  );
}