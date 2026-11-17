"use client";

import { useState } from "react";
import { fetchAdrRevPar } from "@/service/hotel/dashboard/adrRevPar";
import type { AdrRevPar } from "@/types/hotel";

export function useAdrRevPar() {
  const [data, setData] = useState<AdrRevPar | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, from: string, to: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdrRevPar(establishmentId, from, to);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar ADR/RevPAR");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}