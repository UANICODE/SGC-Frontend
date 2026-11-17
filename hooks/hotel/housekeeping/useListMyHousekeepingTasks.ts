"use client";

import { useState } from "react";
import { listMyHousekeepingTasks } from "@/service/hotel/housekeeping/listMyTasks";
import type { HousekeepingTask } from "@/types/hotel";

export function useListMyHousekeepingTasks() {
  const [data, setData] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, statusCode: string = "PENDING") {
    try {
      setLoading(true);
      setError(null);
      const res = await listMyHousekeepingTasks(establishmentId, statusCode);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar as minhas tarefas");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}