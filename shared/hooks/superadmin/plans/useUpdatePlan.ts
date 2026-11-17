"use client";

import { updatePlan } from "@/shared/service/superadmin/plans/updatePlan";
import { Plan, UpdatePlanInput } from "@/shared/types/superadmin/plan";
import { useState } from "react";

export function useUpdatePlan() {
  const [data, setData] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(planId: string, input: UpdatePlanInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await updatePlan(planId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar plano");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, update };
}