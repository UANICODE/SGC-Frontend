"use client";

import { useState } from "react";
import { assignHousekeepingTask } from "@/service/hotel/housekeeping/assignTask";
import type { AssignHousekeepingTaskInput, HousekeepingTask } from "@/types/hotel";

export function useAssignHousekeepingTask() {
  const [data, setData] = useState<HousekeepingTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function assign(
    establishmentId: string,
    taskId: string,
    input: AssignHousekeepingTaskInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await assignHousekeepingTask(establishmentId, taskId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atribuir tarefa de limpeza");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, assign };
}