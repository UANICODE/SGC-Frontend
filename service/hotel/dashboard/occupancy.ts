// service/hotel/dashboard/occupancy.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { OccupancySummary } from "@/types/hotel";

export async function fetchOccupancy(
  establishmentId: string,
): Promise<OccupancySummary> {
  try {
    const { data } = await api.get<OccupancySummary>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/occupancy`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}