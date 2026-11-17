"use client";

import { listModules } from "@/shared/service/superadmin/module/listModules";
import { Module } from "@/shared/types/superadmin/module";
import { useState } from "react";


export function useListModules() {
  const [data, setData] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch() {
    try {
      setLoading(true);
      setError(null);

      const res = await listModules();
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar módulos");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}