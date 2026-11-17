"use client";

import { createPlan } from "@/shared/service/superadmin/plans/createPlan";
import { CreatePlanInput, Plan } from "@/shared/types/superadmin";
import { useState } from "react";


export function useCreatePlan() {
  const [data, setData] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(input: CreatePlanInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await createPlan(input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar plano");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}