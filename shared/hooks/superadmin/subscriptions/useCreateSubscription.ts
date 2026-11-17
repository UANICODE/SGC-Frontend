"use client";

import { createSubscription } from "@/shared/service/superadmin/subscriptions/createSubscription";
import { CreateSubscriptionInput, Subscription } from "@/shared/types/superadmin/subscription";
import { useState } from "react";


export function useCreateSubscription() {
  const [data, setData] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(input: CreateSubscriptionInput) {
    try {
      setLoading(true);
      setError(null);

      const res = await createSubscription(input);
      setData(res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Erro ao criar subscrição");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, create };
}