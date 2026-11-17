"use client";

import { useState } from "react";
import { searchGuests } from "@/service/hotel/guests/searchGuests";
import type { Guest, HotelApiRole } from "@/types/hotel";

export function useSearchGuests() {
  const [data, setData] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(
    establishmentId: string,
    term?: string,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await searchGuests(establishmentId, term, role);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar hóspedes");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}