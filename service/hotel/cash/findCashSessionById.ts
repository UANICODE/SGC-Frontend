// service/hotel/cash/findCashSessionById.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CashSession } from "@/types/hotel";

export async function findCashSessionById(
  establishmentId: string,
  sessionId: string,
): Promise<CashSession> {
  try {
    const { data } = await api.get<CashSession>(
      `/api/admin/hotel/establishments/${establishmentId}/cash-sessions/${sessionId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}