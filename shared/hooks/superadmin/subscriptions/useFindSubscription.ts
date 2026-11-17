"use client";

import { findSubscription } from "@/shared/service/superadmin/subscriptions/findSubscription";
import { Subscription } from "@/shared/types/superadmin/subscription";
import { useState } from "react";


export function useFindSubscription() {
  const [data, setData] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(subscriptionId: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await findSubscription(subscriptionId);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar subscrição");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}