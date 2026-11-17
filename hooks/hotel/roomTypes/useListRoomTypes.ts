"use client";

import { useState } from "react";
import { listRoomTypes } from "@/service/hotel/roomTypes/listRoomTypes";
import type { RoomType } from "@/types/hotel";

export function useListRoomTypes() {
  const [data, setData] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await listRoomTypes(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar tipos de quarto");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}