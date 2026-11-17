"use client";

import { useState } from "react";
import { checkOut } from "@/service/hotel/checkout/checkOut";
import type { CheckOutInput, Reservation } from "@/types/hotel";

export function useCheckOut() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(establishmentId: string, input: CheckOutInput) {
    try {
      setLoading(true);
      setError(null);
      const res = await checkOut(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao realizar check-out");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, execute };
}