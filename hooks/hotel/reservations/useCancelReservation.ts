"use client";

import { useState } from "react";
import { cancelReservation } from "@/service/hotel/reservations/cancelReservation";
import type { HotelApiRole, Reservation } from "@/types/hotel";

export function useCancelReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel(
    establishmentId: string,
    reservationId: string,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await cancelReservation(establishmentId, reservationId, role);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao cancelar reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, cancel };
}