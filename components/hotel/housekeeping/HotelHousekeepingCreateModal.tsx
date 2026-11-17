"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useListRooms } from "@/hooks/hotel/rooms/useListRooms";
import { useCreateHousekeepingTask } from "@/hooks/hotel/housekeeping/useCreateHousekeepingTask";
import { useToast } from "@/ context/ToastContext";

interface Props {
  open: boolean;
  establishmentId: string;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function HotelHousekeepingCreateModal({
  open,
  establishmentId,
  onClose,
  onCreated,
}: Props) {
  const { showToast } = useToast();
  const rooms = useListRooms();
  const { create, loading } = useCreateHousekeepingTask();

  const [roomId, setRoomId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    void rooms.fetch(establishmentId, "admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, establishmentId]);

  useEffect(() => {
    if (!open) return;
    setRoomId(rooms.data[0]?.id ?? "");
  }, [open, rooms.data]);

  if (!open) return null;

  async function handleSubmit() {
    if (!roomId) {
      showToast("Selecione um quarto.", "error");
      return;
    }
    try {
      await create(establishmentId, {
        roomId,
        assignedToUserUid: assignedTo.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      showToast("Tarefa criada.", "success");
      setRoomId("");
      setAssignedTo("");
      setNotes("");
      onClose();
      await onCreated();
    } catch (err: any) {
      showToast(err?.message || "Falha ao criar tarefa.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Nova tarefa de limpeza
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
              Quarto
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione…</option>
              {rooms.data.map((r) => (
                <option key={r.id} value={r.id}>
                  Nº {r.number} · {r.roomType.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Atribuir a (UID do utilizador)
            </label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="opcional"
              className={inputClass}
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Se deixares vazio, a tarefa fica pendente até ser atribuída.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            {loading ? "A criar..." : "Criar tarefa"}
          </button>
        </div>
      </div>
    </div>
  );
}