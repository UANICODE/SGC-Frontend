"use client";

import { useState } from "react";
import { fetchRevenue } from "@/service/hotel/dashboard/revenue";
import type { RevenueSummary } from "@/types/hotel";

export function useRevenueSummary() {
  const [data, setData] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, from: string, to: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRevenue(establishmentId, from, to);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar faturação");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}