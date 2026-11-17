"use client";

import { useState } from "react";
import { createReservation } from "@/service/hotel/reservations/createReservation";
import type { CreateReservationInput, HotelApiRole, Reservation } from "@/types/hotel";

export function useCreateReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    establishmentId: string,
    input: CreateReservationInput,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await createReservation(establishmentId, input, role);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}