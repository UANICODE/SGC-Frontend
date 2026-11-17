"use client";

import { useState } from "react";
import { listAvailableRooms } from "@/service/hotel/rooms/listAvailableRooms";
import type { HotelApiRole, Room } from "@/types/hotel";

export function useListAvailableRooms() {
  const [data, setData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(
    establishmentId: string,
    from: string,
    to: string,
    role: HotelApiRole = "admin",
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await listAvailableRooms(establishmentId, from, to, role);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar quartos disponíveis");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}