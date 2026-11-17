// service/hotel/cash/listCashSessions.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CashSession } from "@/types/hotel";

export async function listCashSessions(
  establishmentId: string,
  closed?: boolean,
): Promise<CashSession[]> {
  try {
    const { data } = await api.get<CashSession[]>(
      `/api/admin/hotel/establishments/${establishmentId}/cash-sessions`,
      { params: closed === undefined ? undefined : { closed } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}