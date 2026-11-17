"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { useAssignHousekeepingTask } from "@/hooks/hotel/housekeeping/useAssignHousekeepingTask";
import { useToast } from "@/ context/ToastContext";
import type { HousekeepingTask } from "@/types/hotel";

interface Props {
  open: boolean;
  establishmentId: string;
  task: HousekeepingTask;
  onClose: () => void;
  onAssigned: () => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function HotelHousekeepingAssignModal({
  open,
  establishmentId,
  task,
  onClose,
  onAssigned,
}: Props) {
  const { showToast } = useToast();
  const { assign, loading } = useAssignHousekeepingTask();
  const [assignedTo, setAssignedTo] = useState(task.assignedToUid ?? "");

  if (!open) return null;

  async function handleSubmit() {
    if (!assignedTo.trim()) {
      showToast("Indique o UID do utilizador.", "error");
      return;
    }
    try {
      await assign(establishmentId, task.id, {
        assignedToUserUid: assignedTo.trim(),
      });
      showToast("Tarefa atribuída.", "success");
      onClose();
      await onAssigned();
    } catch (err: any) {
      showToast(err?.message || "Falha ao atribuir tarefa.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Atribuir tarefa — Nº {task.roomNumber}
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

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            UID do funcionário
          </label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="ex.: 5b1f-...-uid"
            className={inputClass}
          />
          <p className="mt-1 text-[11px] text-gray-400">
            Cole o UID do utilizador. (Numa iteração futura isto será um
            dropdown de funcionários do estabelecimento.)
          </p>
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
            {loading ? "A guardar..." : "Atribuir"}
          </button>
        </div>
      </div>
    </div>
  );
}