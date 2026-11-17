"use client";

import { useState } from "react";
import { confirmReservation } from "@/service/hotel/reservations/confirmReservation";
import type { HotelApiRole, Reservation } from "@/types/hotel";

export function useConfirmReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm(
    establishmentId: string,
    reservationId: string,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await confirmReservation(establishmentId, reservationId, role);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao confirmar reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, confirm };
}