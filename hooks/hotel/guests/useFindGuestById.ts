"use client";

import { useState } from "react";
import { findGuestById } from "@/service/hotel/guests/findGuestById";
import type { Guest, HotelApiRole } from "@/types/hotel";

export function useFindGuestById() {
  const [data, setData] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(
    establishmentId: string,
    guestId: string,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await findGuestById(establishmentId, guestId, role);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar hóspede");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}