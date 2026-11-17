// service/hotel/cash/openCashSession.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CashSession, OpenCashSessionInput } from "@/types/hotel";

export async function openCashSession(
  establishmentId: string,
  input: OpenCashSessionInput,
): Promise<CashSession> {
  try {
    const { data } = await api.post<CashSession>(
      `/api/admin/hotel/establishments/${establishmentId}/cash-sessions`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}