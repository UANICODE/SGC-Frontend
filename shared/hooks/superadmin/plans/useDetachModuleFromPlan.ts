"use client";

import { detachModuleFromPlan } from "@/shared/service/superadmin/plans/detachModule";
import { useState } from "react";


export function useDetachModuleFromPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function detach(planId: string, moduleId: string) {
    try {
      setLoading(true);
      setError(null);

      await detachModuleFromPlan(planId, moduleId);
    } catch (err: any) {
      setError(err?.message || "Erro ao remover módulo do plano");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, detach };
}