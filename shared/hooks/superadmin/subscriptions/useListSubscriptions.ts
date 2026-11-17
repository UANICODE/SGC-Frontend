"use client";

import { listSubscriptions } from "@/shared/service/superadmin/subscriptions/listSubscriptions";
import { SubscriptionStatus } from "@/shared/types/superadmin/common";
import { Subscription } from "@/shared/types/superadmin/subscription";
import { useState } from "react";


export function useListSubscriptions() {
  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(status?: SubscriptionStatus) {
    try {
      setLoading(true);
      setError(null);

      const res = await listSubscriptions(status);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar subscrições");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}