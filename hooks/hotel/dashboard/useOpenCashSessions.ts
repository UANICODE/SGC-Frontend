"use client";

import { useState } from "react";
import { fetchOpenCashSessions } from "@/service/hotel/dashboard/openCashSessions";
import type { OpenCashSessionSummary } from "@/types/hotel";

export function useOpenCashSessions() {
  const [data, setData] = useState<OpenCashSessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchOpenCashSessions(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar caixas abertos");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}