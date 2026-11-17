// service/hotel/dashboard/recentMovements.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { RecentMovement } from "@/types/hotel";

export async function fetchRecentMovements(
  establishmentId: string,
  limit: number = 10,
): Promise<RecentMovement[]> {
  try {
    const { data } = await api.get<RecentMovement[]>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/recent-movements`,
      { params: { limit } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}