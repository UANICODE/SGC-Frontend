"use client";

import { useState } from "react";
import { addCompanionToReservation } from "@/service/hotel/reservations/addCompanionToReservation";
import type { Reservation } from "@/types/hotel";

export function useAddCompanionToReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(
    establishmentId: string,
    reservationId: string,
    guestId: string,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await addCompanionToReservation(
        establishmentId,
        reservationId,
        guestId,
      );
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao adicionar acompanhante");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, add };
}