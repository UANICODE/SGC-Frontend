"use client";

import { useState } from "react";
import { updateRoom } from "@/service/hotel/rooms/updateRoom";
import type { Room, UpdateRoomInput } from "@/types/hotel";

export function useUpdateRoom() {
  const [data, setData] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(
    establishmentId: string,
    roomId: string,
    input: UpdateRoomInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await updateRoom(establishmentId, roomId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar quarto");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, update };
}