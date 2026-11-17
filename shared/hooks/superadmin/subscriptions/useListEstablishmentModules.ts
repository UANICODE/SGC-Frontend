"use client";

import { listEstablishmentModules } from "@/shared/service/superadmin/module/listEstablishmentModules";
import { EstablishmentModule } from "@/shared/types/superadmin/establishmentModule";
import { useState } from "react";


export function useListEstablishmentModules() {
  const [data, setData] = useState<EstablishmentModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await listEstablishmentModules(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar módulos do estabelecimento");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}