"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { useRegisterCashMovement } from "@/hooks/hotel/cash/useRegisterCashMovement";
import { useListReservations } from "@/hooks/hotel/reservations/useListReservations";
import { useToast } from "@/ context/ToastContext";
import { CASH_MOVEMENT_TYPE } from "@/types/hotel/catalogs";
import type { CashMovementTypeCode } from "@/types/hotel";
import type { PaymentMethod } from "@/types/restaurant/attendant/sale/PaymentMethod";
import { listPaymentMethods } from "@/service/restaurant/attendant/paymentMethod";

interface Props {
  open: boolean;
  establishmentId: string;
  sessionId: string;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const TYPE_OPTIONS = Object.entries(CASH_MOVEMENT_TYPE) as Array<
  [CashMovementTypeCode, (typeof CASH_MOVEMENT_TYPE)[CashMovementTypeCode]]
>;

// Tipos de entrada que podem estar ligados a uma reserva
const RESERVATION_TYPES = new Set<CashMovementTypeCode>([
  "RESERVATION_DEPOSIT",
  "CHECKIN_PAYMENT",
  "CHECKOUT_PAYMENT",
  "STAY_EXTENSION_PAYMENT",
]);

export function HotelCashMovementModal({
  open,
  establishmentId,
  onClose,
  onCreated,
}: Props) {
  const { showToast } = useToast();
  const { register, loading } = useRegisterCashMovement();
  const { data: reservations, fetch: loadReservations } = useListReservations();

  const [typeCode, setTypeCode] = useState<CashMovementTypeCode>(
    "RESERVATION_DEPOSIT",
  );
  const [amount, setAmount] = useState("0");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [description, setDescription] = useState("");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  // Carrega métodos e reservas quando abre
  useEffect(() => {
    if (!open) return;

    listPaymentMethods()
      .then((list) => {
        setMethods(list);
        setPaymentMethodId(list[0]?.id ?? "");
      })
      .catch(() => setMethods([]));

    void loadReservations(establishmentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, establishmentId]);

  const meta = useMemo(
    () => TYPE_OPTIONS.find(([code]) => code === typeCode)?.[1],
    [typeCode],
  );

  // Reservas elegíveis (pagamentos aplicam-se a reservas confirmadas ou em estadia)
  const eligibleReservations = useMemo(() => {
    return reservations.filter(
      (r) => r.statusCode === "CONFIRMED" || r.statusCode === "CHECKED_IN",
    );
  }, [reservations]);

  const showReservationField = RESERVATION_TYPES.has(typeCode);

  if (!open) return null;

  async function handleSubmit() {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      showToast("Indique um valor válido.", "error");
      return;
    }
    if (meta?.requiresPaymentMethod && !paymentMethodId) {
      showToast("Selecione um método de pagamento.", "error");
      return;
    }

    try {
      await register(establishmentId, {
        movementTypeCode: typeCode,
        amount: value,
        paymentMethodId: meta?.requiresPaymentMethod
          ? paymentMethodId
          : undefined,
        reservationId: showReservationField && reservationId ? reservationId : undefined,
        description: description.trim() || undefined,
      });

      showToast("Movimento registado.", "success");
      setAmount("0");
      setDescription("");
      setReservationId("");
      onClose();
      await onCreated();
    } catch (err: any) {
      showToast(err?.message || "Falha ao registar movimento.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Novo movimento</h3>
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
          {/* Tipo */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tipo
            </label>
            <select
              value={typeCode}
              onChange={(e) => setTypeCode(e.target.value as CashMovementTypeCode)}
              className={inputClass}
            >
              {TYPE_OPTIONS.map(([code, m]) => (
                <option key={code} value={code}>
                  {m.label} ({m.inflow ? "entrada" : "saída"})
                </option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Valor (MZN)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Método de pagamento */}
          {meta?.requiresPaymentMethod && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Método de pagamento
              </label>
              <select
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                className={inputClass}
              >
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 👇 Reserva — aparece apenas nos tipos que aceitam reserva */}
          {showReservationField && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reserva (opcional)
              </label>
              <select
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                className={inputClass}
              >
                <option value="">— Sem reserva associada —</option>
                {eligibleReservations.map((r) => {
                  const currency = new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "MZN",
                  });
                  return (
                    <option key={r.id} value={r.id}>
                      {r.code} · {r.guestFullName} · Saldo:{" "}
                      {currency.format(r.remainingAmount)}
                    </option>
                  );
                })}
              </select>
              <p className="mt-1 text-[11px] text-gray-400">
                Selecione a reserva para abater o valor pago ao total da reserva.
              </p>
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputClass}
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
            disabled={loading}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "A registar..." : "Registar"}
          </button>
        </div>
      </div>
    </div>
  );
}