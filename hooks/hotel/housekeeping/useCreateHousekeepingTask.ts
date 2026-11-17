"use client";

import { useState } from "react";
import { createHousekeepingTask } from "@/service/hotel/housekeeping/createTask";
import type { CreateHousekeepingTaskInput, HousekeepingTask } from "@/types/hotel";

export function useCreateHousekeepingTask() {
  const [data, setData] = useState<HousekeepingTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(
    establishmentId: string,
    input: CreateHousekeepingTaskInput,
  ) {
    try {
      setLoading(true);
      setError(null);
      const res = await createHousekeepingTask(establishmentId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar tarefa de limpeza");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}