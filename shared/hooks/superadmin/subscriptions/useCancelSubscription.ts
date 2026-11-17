"use client";

import { cancelSubscription } from "@/shared/service/superadmin/subscriptions/cancelSubscription";
import { useState } from "react";

export function useCancelSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel(subscriptionId: string) {
    try {
      setLoading(true);
      setError(null);

      await cancelSubscription(subscriptionId);
    } catch (err: any) {
      setError(err?.message || "Erro ao cancelar subscrição");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, cancel };
}