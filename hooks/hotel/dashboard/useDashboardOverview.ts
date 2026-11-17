"use client";

import { useState } from "react";
import { fetchDashboardOverview } from "@/service/hotel/dashboard/overview";
import type { DashboardOverview } from "@/types/hotel";

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDashboardOverview(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar visão geral");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}