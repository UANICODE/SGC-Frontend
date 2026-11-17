"use client";

import { listGlobalCashRegisters } from "@/service/restaurant/superadmin/cashregisters/listGlobalCashRegisters";
import { ListGlobalCashRegistersRequest, ListGlobalCashRegistersResponse } from "@/types/restaurant/superadmin/cashregisters/listGlobalCashRegisters";
import { useCallback, useState } from "react";

export function useListGlobalCashRegisters() {
  const [data, setData] =
    useState<ListGlobalCashRegistersResponse | null>(
      null
    );

  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (
      payload: ListGlobalCashRegistersRequest
    ) => {
      try {
        setLoading(true);

        const result =
          await listGlobalCashRegisters(payload);

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