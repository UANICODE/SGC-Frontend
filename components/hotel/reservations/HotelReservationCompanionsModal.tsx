"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, UserPlus, X } from "lucide-react";

import { useSearchGuests } from "@/hooks/hotel/guests/useSearchGuests";
import { useAddCompanionToReservation } from "@/hooks/hotel/reservations/useAddCompanionToReservation";
import { useRemoveCompanionFromReservation } from "@/hooks/hotel/reservations/useRemoveCompanionFromReservation";
import { useToast } from "@/ context/ToastContext";
import type { Reservation } from "@/types/hotel";

interface Props {
  open: boolean;
  establishmentId: string;
  reservation: Reservation;
  onClose: () => void;
  onUpdated: (updatedReservation: Reservation) => void;
}

export function HotelReservationCompanionsModal({
  open,
  establishmentId,
  reservation,
  onClose,
  onUpdated,
}: Props) {
  const { showToast } = useToast();
  const { data: searchResults, fetch: searchGuests, loading: searching } = useSearchGuests();
  const { add, loading: adding } = useAddCompanionToReservation();
  const { remove, loading: removing } = useRemoveCompanionFromReservation();

  const [term, setTerm] = useState("");

  useEffect(() => {
    if (!open || !term.trim()) return;
    const timer = setTimeout(() => {
      searchGuests(establishmentId, term);
    }, 300);
    return () => clearTimeout(timer);
  }, [term, open, establishmentId, searchGuests]);

  if (!open) return null;

  // Filtrar resultados que já são acompanhantes ou o próprio hóspede principal
  const filteredSearch = searchResults.filter(
    (g) =>
      g.id !== reservation.guestId &&
      !reservation.companions.some((c) => c.guestId === g.id)
  );

  async function handleAdd(guestId: string) {
    try {
      const updated = await add(establishmentId, reservation.id, guestId);
      showToast("Acompanhante adicionado.", "success");
      setTerm("");
      onUpdated(updated);
    } catch (err: any) {
      showToast(err?.message || "Erro ao adicionar.", "error");
    }
  }

  async function handleRemove(companionId: string) {
    try {
      const updated = await remove(establishmentId, reservation.id, companionId);
      showToast("Acompanhante removido.", "success");
      onUpdated(updated);
    } catch (err: any) {
      showToast(err?.message || "Erro ao remover.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Acompanhantes da Reserva
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Lista Atual */}
        {reservation.companions.length > 0 ? (
          <ul className="mb-6 divide-y divide-gray-100 rounded-xl border border-gray-200">
            {reservation.companions.map((c) => (
              <li key={c.id} className="flex items-center justify-between p-3">
                <span className="text-sm font-medium text-gray-800">{c.guestFullName}</span>
                <button
                  onClick={() => handleRemove(c.id)}
                  disabled={removing}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-6 text-center text-sm text-gray-500">Nenhum acompanhante adicionado.</p>
        )}

        {/* Adicionar Novo */}
        <div>
          <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">
            Adicionar hóspede
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Pesquisar por nome..."
              className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          {searching && <p className="mt-2 text-xs text-gray-400 text-center">A pesquisar...</p>}
          
          {!searching && term.trim().length > 0 && filteredSearch.length === 0 && (
            <p className="mt-2 text-xs text-gray-400 text-center">Nenhum hóspede encontrado.</p>
          )}

          {filteredSearch.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50">
              {filteredSearch.map((g) => (
                <li key={g.id} className="flex items-center justify-between border-b border-gray-100 p-2 last:border-0 hover:bg-white">
                  <span className="text-sm text-gray-700">{g.fullName}</span>
                  <button
                    onClick={() => handleAdd(g.id)}
                    disabled={adding}
                    className="text-primary hover:bg-primary/10 p-1.5 rounded-lg disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}