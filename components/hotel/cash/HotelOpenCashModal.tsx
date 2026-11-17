"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (openingBalance: number) => void | Promise<void>;
  loading: boolean;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function HotelOpenCashModal({ open, onClose, onSubmit, loading }: Props) {
  const [balance, setBalance] = useState("0");

  if (!open) return null;

  async function handle() {
    const value = Number(balance);
    if (!Number.isFinite(value) || value < 0) return;
    await onSubmit(value);
    setBalance("0");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Abrir caixa</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Saldo inicial (MZN)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className={inputClass}
          />
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
            onClick={handle}
            disabled={loading}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "A abrir..." : "Abrir caixa"}
          </button>
        </div>
      </div>
    </div>
  );
}