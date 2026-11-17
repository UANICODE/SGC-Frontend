"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreateRoomType } from "@/hooks/hotel/roomTypes/useCreateRoomType";
import { useToast } from "@/ context/ToastContext";

interface Props {
  open: boolean;
  establishmentId: string;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function HotelRoomTypeFormModal({
  open,
  establishmentId,
  onClose,
  onCreated,
}: Props) {
  const { showToast } = useToast();
  const { create, loading } = useCreateRoomType();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [beds, setBeds] = useState("1");
  const [basePricePerNight, setBasePricePerNight] = useState("");
  const [basePricePerHour, setBasePricePerHour] = useState("");

  if (!open) return null;

  function reset() {
    setName("");
    setDescription("");
    setCapacity("1");
    setBeds("1");
    setBasePricePerNight("");
    setBasePricePerHour("");
  }

  async function handleSubmit() {
    const cap = Number(capacity);
    const numBeds = Number(beds);

    if (!name.trim()) {
      showToast("Indique o nome do tipo de quarto.", "error");
      return;
    }
    if (!Number.isFinite(cap) || cap < 1) {
      showToast("Capacidade inválida.", "error");
      return;
    }
    if (!Number.isFinite(numBeds) || numBeds < 1) {
      showToast("Número de camas inválido.", "error");
      return;
    }

    const nightValue = basePricePerNight.trim() === "" ? null : Number(basePricePerNight);
    const hourValue = basePricePerHour.trim() === "" ? null : Number(basePricePerHour);

    if (nightValue === null && hourValue === null) {
      showToast("Indique pelo menos um preço: por noite ou por hora.", "error");
      return;
    }
    if (nightValue !== null && (!Number.isFinite(nightValue) || nightValue < 0)) {
      showToast("Preço por noite inválido.", "error");
      return;
    }
    if (hourValue !== null && (!Number.isFinite(hourValue) || hourValue < 0)) {
      showToast("Preço por hora inválido.", "error");
      return;
    }

    try {
      await create(establishmentId, {
        name: name.trim(),
        description: description.trim() || undefined,
        capacity: cap,
        beds: numBeds,
        basePricePerNight: nightValue,
        basePricePerHour: hourValue,
      });
      showToast("Tipo de quarto criado.", "success");
      reset();
      onClose();
      await onCreated();
    } catch (err: any) {
      showToast(err?.message || "Falha ao criar tipo de quarto.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Novo tipo de quarto
          </h3>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Nome">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Suite Presidencial"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacidade">
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Camas">
              <input
                type="number"
                min="1"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço por noite (MZN)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={basePricePerNight}
                onChange={(e) => setBasePricePerNight(e.target.value)}
                placeholder="Ex: 3500"
                className={inputClass}
              />
            </Field>
            <Field label="Preço por hora (MZN)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={basePricePerHour}
                onChange={(e) => setBasePricePerHour(e.target.value)}
                placeholder="Ex: 500"
                className={inputClass}
              />
            </Field>
          </div>

          <p className="text-[11px] text-gray-500">
            Preencha pelo menos um dos preços. Deixe vazio o preço que o quarto
            não aceita (ex.: só noites → deixe "por hora" vazio).
          </p>

          <Field label="Descrição (opcional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
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
            {loading ? "A guardar..." : "Criar tipo"}
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