"use client";

import { useState } from "react";
import { createRoomType } from "@/service/hotel/roomTypes/createRoomType";
import type { CreateRoomTypeInput, RoomType } from "@/types/hotel";

export function useCreateRoomType() {
  const [data, setData] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(establishmentId: string, input: CreateRoomTypeInput) {
    try {
      setLoading(true);
      setError(null);
      const res = await createRoomType(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar tipo de quarto");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}