// service/hotel/dashboard/revenue.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { RevenueSummary } from "@/types/hotel";

export async function fetchRevenue(
  establishmentId: string,
  from: string,
  to: string,
): Promise<RevenueSummary> {
  try {
    const { data } = await api.get<RevenueSummary>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/revenue`,
      { params: { from, to } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}