"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCreateRoom } from "@/hooks/hotel/rooms/useCreateRoom";
import { useUpdateRoom } from "@/hooks/hotel/rooms/useUpdateRoom";
import { useToast } from "@/ context/ToastContext";
import type { Room, RoomType } from "@/types/hotel";

interface Props {
  open: boolean;
  establishmentId: string;
  roomTypes: RoomType[];
  editingRoom: Room | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function HotelRoomFormModal({
  open,
  establishmentId,
  roomTypes,
  editingRoom,
  onClose,
  onSaved,
}: Props) {
  const { showToast } = useToast();
  const { create, loading: creating } = useCreateRoom();
  const { update, loading: updating } = useUpdateRoom();
  const loading = creating || updating;

  const [roomTypeId, setRoomTypeId] = useState("");
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editingRoom) {
      setRoomTypeId(editingRoom.roomType.id);
      setNumber(editingRoom.number);
      setFloor(editingRoom.floor ?? "");
      setLocation(editingRoom.location ?? "");
      setNotes(editingRoom.notes ?? "");
    } else {
      setRoomTypeId(roomTypes[0]?.id ?? "");
      setNumber("");
      setFloor("");
      setLocation("");
      setNotes("");
    }
  }, [open, editingRoom, roomTypes]);

  if (!open) return null;

  async function handleSubmit() {
    if (!roomTypeId) {
      showToast("Selecione um tipo de quarto.", "error");
      return;
    }
    if (!number.trim()) {
      showToast("Indique o número do quarto.", "error");
      return;
    }

    const payload = {
      roomTypeId,
      number: number.trim(),
      floor: floor.trim() || undefined,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      if (editingRoom) {
        await update(establishmentId, editingRoom.id, payload);
        showToast("Quarto atualizado.", "success");
      } else {
        await create(establishmentId, payload);
        showToast("Quarto criado.", "success");
      }
      onClose();
      await onSaved();
    } catch (err: any) {
      showToast(err?.message || "Falha ao guardar quarto.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingRoom ? "Editar quarto" : "Novo quarto"}
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

        {roomTypes.length === 0 ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
            Crie primeiro um <strong>tipo de quarto</strong> antes de registar
            quartos.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <Field label="Tipo de quarto">
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                className={inputClass}
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} · {t.capacity} pax
                    {t.basePricePerNight != null
                      ? ` · ${t.basePricePerNight} MZN/noite`
                      : ""}
                    {t.basePricePerHour != null
                      ? ` · ${t.basePricePerHour} MZN/hora`
                      : ""}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Número">
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="101"
                  className={inputClass}
                />
              </Field>
              <Field label="Piso">
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="1"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Localização (opcional)">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ala sul"
                className={inputClass}
              />
            </Field>

            <Field label="Notas (opcional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className={inputClass}
              />
            </Field>
          </div>
        )}

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
            disabled={loading || roomTypes.length === 0}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "A guardar..." : editingRoom ? "Guardar" : "Criar quarto"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}