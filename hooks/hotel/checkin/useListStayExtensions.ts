"use client";

import { useState } from "react";
import type { StayExtension } from "@/types/hotel";
import { listStayExtensions } from "@/service/hotel/checkin/listStayExtensions";

export function useListStayExtensions() {
  const [data, setData] = useState<StayExtension[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, reservationRoomId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await listStayExtensions(establishmentId, reservationRoomId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar extensões de estadia");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}