"use client";

import { useState } from "react";
import { fetchRecentReservations } from "@/service/hotel/dashboard/recentReservations";
import type { RecentReservation } from "@/types/hotel";

export function useRecentReservations() {
  const [data, setData] = useState<RecentReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, limit: number = 10) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRecentReservations(establishmentId, limit);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar reservas recentes");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}