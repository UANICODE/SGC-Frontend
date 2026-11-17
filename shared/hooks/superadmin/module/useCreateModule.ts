"use client";

import { createModule } from "@/shared/service/superadmin/module/createModule";
import { CreateModuleInput, Module } from "@/shared/types/superadmin/module";
import { useState } from "react";


export function useCreateModule() {
  const [data, setData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(input: CreateModuleInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await createModule(input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar módulo");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}