"use client";

import { useState } from "react";
import type { ExtendStayInput, HotelApiRole, StayExtension } from "@/types/hotel";
import { extendStay } from "@/service/hotel/checkin/extendStay";

export function useExtendStay() {
  const [data, setData] = useState<StayExtension | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(
    establishmentId: string,
    input: ExtendStayInput,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await extendStay(establishmentId, input, role);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao estender estadia");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, execute };
}