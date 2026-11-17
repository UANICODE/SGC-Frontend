"use client";

import { assignModuleToEstablishment } from "@/shared/service/superadmin/module/assignModule";
import { AssignModuleInput } from "@/shared/types/superadmin/establishmentModule";
import { useState } from "react";


export function useAssignModuleToEstablishment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function assign(establishmentId: string, input: AssignModuleInput) {
    try {
      setLoading(true);
      setError(null);

      await assignModuleToEstablishment(establishmentId, input);
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar módulo do estabelecimento");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, assign };
}