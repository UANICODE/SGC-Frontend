"use client";

import { useState } from "react";
import { closeCashSession } from "@/service/hotel/cash/closeCashSession";
import type { CashSessionSummary, CloseCashSessionInput } from "@/types/hotel";

export function useCloseCashSession() {
  const [data, setData] = useState<CashSessionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function close(establishmentId: string, input: CloseCashSessionInput) {
    try {
      setLoading(true);
      setError(null);
      const res = await closeCashSession(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao fechar caixa");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, close };
}