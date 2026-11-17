"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}

const TONE_BTN: Record<"danger" | "primary", string> = {
  danger: "bg-rose-600 hover:bg-rose-700",
  primary: "bg-cyan-600 hover:bg-cyan-700",
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  tone = "primary",
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-600">{description}</p>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${TONE_BTN[tone]}`}
          >
            {loading ? "A processar..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}