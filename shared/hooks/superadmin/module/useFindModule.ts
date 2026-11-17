"use client";

import { findModule } from "@/shared/service/superadmin/module/findModule";
import { Module } from "@/shared/types/superadmin/module";
import { useState } from "react";


export function useFindModule() {
  const [data, setData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(moduleId: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await findModule(moduleId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar módulo");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}