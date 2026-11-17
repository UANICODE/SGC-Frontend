"use client";

import { updateSubscription } from "@/shared/service/superadmin/subscriptions/updateSubscription";
import { Subscription, UpdateSubscriptionInput } from "@/shared/types/superadmin/subscription";
import { useState } from "react";


export function useUpdateSubscription() {
  const [data, setData] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(subscriptionId: string, input: UpdateSubscriptionInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await updateSubscription(subscriptionId, input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar subscrição");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, update };
}