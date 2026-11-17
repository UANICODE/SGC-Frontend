"use client";

import { getLoggedEstablishment } from "@/shared/service/auth/logged-establishment";
import { LoggedEstablishmentResponse } from "@/shared/types/auth/LoggedEstablishmentResponse";
import { useEffect, useState } from "react";

export function useEstablishment(establishmentId: string) {
  const [data, setData] =
    useState<LoggedEstablishmentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    try {
      setLoading(true);
      const res = await getLoggedEstablishment(
        establishmentId
      );
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [establishmentId]);

  return { data, loading, refresh: fetch };
}