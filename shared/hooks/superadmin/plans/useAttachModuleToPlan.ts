"use client";

import { attachModuleToPlan } from "@/shared/service/superadmin/plans/attachModule";
import { useState } from "react";

export function useAttachModuleToPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function attach(planId: string, moduleId: string) {
    try {
      setLoading(true);
      setError(null);

      await attachModuleToPlan(planId, moduleId);
    } catch (err: any) {
      setError(err?.message || "Erro ao associar módulo ao plano");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, attach };
}