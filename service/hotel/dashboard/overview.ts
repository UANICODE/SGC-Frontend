// service/hotel/dashboard/overview.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { DashboardOverview } from "@/types/hotel";

export async function fetchDashboardOverview(
  establishmentId: string,
): Promise<DashboardOverview> {
  try {
    const { data } = await api.get<DashboardOverview>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/overview`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}