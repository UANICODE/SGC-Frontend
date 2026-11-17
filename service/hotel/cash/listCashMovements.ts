// service/hotel/cash/listCashMovements.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CashMovement } from "@/types/hotel";

export async function listCashMovements(
  establishmentId: string,
  sessionId: string,
): Promise<CashMovement[]> {
  try {
    const { data } = await api.get<CashMovement[]>(
      `/api/admin/hotel/establishments/${establishmentId}/cash-sessions/${sessionId}/movements`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}