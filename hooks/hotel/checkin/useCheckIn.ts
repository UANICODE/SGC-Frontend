"use client";

import { useState } from "react";
import { checkIn } from "@/service/hotel/checkin/checkIn";
import type { CheckInInput, Reservation } from "@/types/hotel";

export function useCheckIn() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(establishmentId: string, input: CheckInInput) {
    try {
      setLoading(true);
      setError(null);
      const res = await checkIn(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao realizar check-in");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, execute };
}