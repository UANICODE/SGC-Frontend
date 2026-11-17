"use client";

import { useState } from "react";
import { addRoomToReservation } from "@/service/hotel/reservations/addRoomToReservation";
import type { AddRoomToReservationInput, Reservation } from "@/types/hotel";

export function useAddRoomToReservation() {
  const [data, setData] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(
    establishmentId: string,
    reservationId: string,
    input: AddRoomToReservationInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await addRoomToReservation(establishmentId, reservationId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao adicionar quarto à reserva");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, add };
}