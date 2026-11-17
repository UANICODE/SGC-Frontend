"use client";

import { useState } from "react";
import { updateReservation } from "@/service/hotel/reservations/updateReservation";
import type { Reservation, UpdateReservationInput } from "@/types/hotel";

export function useUpdateReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(
    establishmentId: string,
    reservationId: string,
    input: UpdateReservationInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await updateReservation(establishmentId, reservationId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, update };
}