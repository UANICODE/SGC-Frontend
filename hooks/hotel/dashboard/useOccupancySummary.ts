"use client";

import { useState } from "react";
import { fetchOccupancy } from "@/service/hotel/dashboard/occupancy";
import type { OccupancySummary } from "@/types/hotel";

export function useOccupancySummary() {
  const [data, setData] = useState<OccupancySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchOccupancy(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar ocupação");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}