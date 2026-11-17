"use client";

import { useState } from "react";
import { registerCashMovement } from "@/service/hotel/cash/registerCashMovement";
import type { CashMovement, RegisterCashMovementInput } from "@/types/hotel";

export function useRegisterCashMovement() {
  const [data, setData] = useState<CashMovement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(
    establishmentId: string,
    input: RegisterCashMovementInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await registerCashMovement(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao registar movimento de caixa");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, register };
}