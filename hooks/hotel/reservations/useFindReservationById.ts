"use client";

import { useState } from "react";
import { findReservationById } from "@/service/hotel/reservations/findReservationById";
import type { Reservation } from "@/types/hotel";

export function useFindReservationById() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, reservationId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await findReservationById(establishmentId, reservationId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar reserva");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}