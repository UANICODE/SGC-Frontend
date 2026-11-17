"use client";

import { useState } from "react";
import { updateGuest } from "@/service/hotel/guests/updateGuest";
import type { Guest, HotelApiRole, UpdateGuestInput } from "@/types/hotel";

export function useUpdateGuest() {
  const [data, setData] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(
    establishmentId: string,
    guestId: string,
    input: UpdateGuestInput,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await updateGuest(establishmentId, guestId, input, role);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar hóspede");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, update };
}