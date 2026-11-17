"use client";

import { createFeature } from "@/shared/service/superadmin/features/createFeature";
import { CreateFeatureInput } from "@/shared/types/superadmin/feature";
import { useState } from "react";


export function useCreateFeature() {
  const [data, setData] = useState<Awaited<ReturnType<typeof createFeature>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(input: CreateFeatureInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await createFeature(input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar funcionalidade");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}