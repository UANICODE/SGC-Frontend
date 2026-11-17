"use client";

import { useState } from "react";
import { openCashSession } from "@/service/hotel/cash/openCashSession";
import type { CashSession, OpenCashSessionInput } from "@/types/hotel";

export function useOpenCashSession() {
  const [data, setData] = useState<CashSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open(establishmentId: string, input: OpenCashSessionInput) {
    try {
      setLoading(true);
      setError(null);
      const res = await openCashSession(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao abrir caixa");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, open };
}