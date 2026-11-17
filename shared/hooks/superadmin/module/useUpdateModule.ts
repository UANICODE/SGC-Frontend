"use client";

import { updateModule } from "@/shared/service/superadmin/module/updateModule";
import { Module, UpdateModuleInput } from "@/shared/types/superadmin/module";
import { useState } from "react";


export function useUpdateModule() {
  const [data, setData] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(moduleId: string, input: UpdateModuleInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await updateModule(moduleId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar módulo");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, update };
}