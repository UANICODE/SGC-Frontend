"use client";

import { useState } from "react";
import { listRooms } from "@/service/hotel/rooms/listRooms";
import type { HotelApiRole, Room } from "@/types/hotel";

export function useListRooms() {
  const [data, setData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, role: HotelApiRole) {
    try {
      setLoading(true);
      setError(null);
      const res = await listRooms(establishmentId, role);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar quartos");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}