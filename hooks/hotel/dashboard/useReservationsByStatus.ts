"use client";

import { useState } from "react";
import { fetchReservationsByStatus } from "@/service/hotel/dashboard/reservationsByStatus";
import type { ReservationStatusCount } from "@/types/hotel";

export function useReservationsByStatus() {
  const [data, setData] = useState<ReservationStatusCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchReservationsByStatus(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar reservas por estado");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}