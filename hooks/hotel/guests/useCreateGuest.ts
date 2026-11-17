"use client";

import { useState } from "react";
import { createGuest } from "@/service/hotel/guests/createGuest";
import type { CreateGuestInput, Guest, HotelApiRole } from "@/types/hotel";

export function useCreateGuest() {
  const [data, setData] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    establishmentId: string,
    input: CreateGuestInput,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await createGuest(establishmentId, input, role);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar hóspede");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}