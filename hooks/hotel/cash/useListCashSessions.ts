"use client";

import { useState } from "react";
import { listCashSessions } from "@/service/hotel/cash/listCashSessions";
import type { CashSession } from "@/types/hotel";

export function useListCashSessions() {
  const [data, setData] = useState<CashSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, closed?: boolean) {
    try {
      setLoading(true);
      setError(null);
      const res = await listCashSessions(establishmentId, closed);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar caixas");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}