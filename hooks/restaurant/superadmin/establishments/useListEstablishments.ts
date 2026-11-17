"use client";

import { useCallback, useState } from "react";
import { listEstablishments } from "@/service/restaurant/superadmin/establishments/listEstablishments";
import {
  ListEstablishmentsRequest,
  ListEstablishmentsResponse,
} from "@/types/restaurant/superadmin/establishments/listEstablishments";

export function useListEstablishments() {
  const [data, setData] =
    useState<ListEstablishmentsResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (payload: ListEstablishmentsRequest) => {
      try {
        setLoading(true);

        const result = await listEstablishments(payload);

        setData(result);

        return result;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    data,
    loading,
    execute,
  };
}