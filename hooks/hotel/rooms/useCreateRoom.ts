"use client";

import { useState } from "react";
import { createRoom } from "@/service/hotel/rooms/createRoom";
import type { CreateRoomInput, Room } from "@/types/hotel";

export function useCreateRoom() {
  const [data, setData] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(establishmentId: string, input: CreateRoomInput) {
    try {
      setLoading(true);
      setError(null);
      const res = await createRoom(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar quarto");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}