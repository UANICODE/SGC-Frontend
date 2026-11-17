"use client";

import { listPlans } from "@/shared/service/superadmin/plans/listPlans";
import { Plan } from "@/shared/types/superadmin/plan";
import { useState } from "react";


interface FetchParams {
  active?: boolean;
  moduleId?: string;
}

export function useListPlans() {
  const [data, setData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(params?: FetchParams) {
    try {
      setLoading(true);
      setError(null);

      const res = await listPlans(params);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}