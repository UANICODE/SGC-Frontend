"use client";

import { useState } from "react";
import { listHousekeepingTasks } from "@/service/hotel/housekeeping/listTasks";
import type { HousekeepingTask } from "@/types/hotel";

export function useListHousekeepingTasks() {
  const [data, setData] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, statusCode: string = "PENDING") {
    try {
      setLoading(true);
      setError(null);
      const res = await listHousekeepingTasks(establishmentId, statusCode);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar tarefas de limpeza");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}