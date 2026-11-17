"use client";

import { listSubscriptionsByEstablishment } from "@/shared/service/superadmin/subscriptions/listByEstablishment";
import { Subscription } from "@/shared/types/superadmin/subscription";
import { useState } from "react";


export function useListSubscriptionsByEstablishment() {
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await listSubscriptionsByEstablishment(establishmentId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar subscrições do estabelecimento");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}