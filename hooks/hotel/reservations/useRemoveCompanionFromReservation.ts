"use client";

import { useState } from "react";
import { removeCompanionFromReservation } from "@/service/hotel/reservations/removeCompanionFromReservation";
import type { Reservation } from "@/types/hotel";

export function useRemoveCompanionFromReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(
    establishmentId: string,
    reservationId: string,
    companionId: string,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await removeCompanionFromReservation(
        establishmentId,
        reservationId,
        companionId,
      );
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao remover acompanhante");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, remove };
}