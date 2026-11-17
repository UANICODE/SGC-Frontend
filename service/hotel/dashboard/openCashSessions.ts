// service/hotel/dashboard/openCashSessions.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { OpenCashSessionSummary } from "@/types/hotel";

export async function fetchOpenCashSessions(
  establishmentId: string,
): Promise<OpenCashSessionSummary[]> {
  try {
    const { data } = await api.get<OpenCashSessionSummary[]>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/open-cash-sessions`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}