"use client";

import { useState } from "react";
import { completeHousekeepingTask } from "@/service/hotel/housekeeping/completeTask";
import type { CompleteHousekeepingTaskInput, HousekeepingTask } from "@/types/hotel";

export function useCompleteHousekeepingTask() {
  const [data, setData] = useState<HousekeepingTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function complete(
    establishmentId: string,
    taskId: string,
    input?: CompleteHousekeepingTaskInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await completeHousekeepingTask(establishmentId, taskId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao concluir tarefa de limpeza");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, complete };
}