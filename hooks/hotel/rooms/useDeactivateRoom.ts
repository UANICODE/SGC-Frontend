"use client";

import { deactivateRoom } from "@/service/hotel/rooms/deactivateRoom";
import { useState } from "react";


export function useDeactivateRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(establishmentId: string, roomId: string) {
    try {
      setLoading(true);
      setError(null);
      await deactivateRoom(establishmentId, roomId);
    } catch (err: any) {
      setError(err?.message || "Erro ao desativar quarto");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, remove };
}