"use client";

import { useState } from "react";
import { listCashMovements } from "@/service/hotel/cash/listCashMovements";
import type { CashMovement } from "@/types/hotel";

export function useListCashMovements() {
  const [data, setData] = useState<CashMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, sessionId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await listCashMovements(establishmentId, sessionId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar movimentos de caixa");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}