"use client";

import { useState } from "react";
import { listReservations } from "@/service/hotel/reservations/listReservations";
import type { Reservation } from "@/types/hotel";

export function useListReservations() {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, statusId?: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await listReservations(establishmentId, statusId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}