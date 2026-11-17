// service/hotel/cash/closeCashSession.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CashSessionSummary, CloseCashSessionInput } from "@/types/hotel";

export async function closeCashSession(
  establishmentId: string,
  input: CloseCashSessionInput,
): Promise<CashSessionSummary> {
  try {
    const { data } = await api.post<CashSessionSummary>(
      `/api/admin/hotel/establishments/${establishmentId}/cash-sessions/close`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}