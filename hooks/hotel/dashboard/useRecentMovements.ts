"use client";

import { useState } from "react";
import { fetchRecentMovements } from "@/service/hotel/dashboard/recentMovements";
import type { RecentMovement } from "@/types/hotel";

export function useRecentMovements() {
  const [data, setData] = useState<RecentMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, limit: number = 10) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRecentMovements(establishmentId, limit);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar movimentos recentes");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}