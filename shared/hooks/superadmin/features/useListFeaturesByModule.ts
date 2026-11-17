"use client";

import { listFeaturesByModule } from "@/shared/service/superadmin/features/listFeaturesByModule";
import { Feature } from "@/shared/types/superadmin";
import { useState } from "react";


export function useListFeaturesByModule() {
  const [data, setData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(moduleId: string, active?: boolean) {
    try {
      setLoading(true);
      setError(null);

      const res = await listFeaturesByModule(moduleId, active);
      setData(res as unknown as Feature[]);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar funcionalidades");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}