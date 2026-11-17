"use client";

import { useState } from "react";
import { findCashSessionById } from "@/service/hotel/cash/findCashSessionById";
import type { CashSession } from "@/types/hotel";

export function useFindCashSessionById() {
  const [data, setData] = useState<CashSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, sessionId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await findCashSessionById(establishmentId, sessionId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar caixa");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}