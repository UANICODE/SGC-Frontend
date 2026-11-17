"use client";

import { useState } from "react";
import { removeRoomFromReservation } from "@/service/hotel/reservations/removeRoomFromReservation";
import type { Reservation } from "@/types/hotel";

export function useRemoveRoomFromReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(
    establishmentId: string,
    reservationId: string,
    reservationRoomId: string,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await removeRoomFromReservation(
        establishmentId,
        reservationId,
        reservationRoomId,
      );
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao remover quarto da reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, remove };
}