// service/hotel/dashboard/recentReservations.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { RecentReservation } from "@/types/hotel";

export async function fetchRecentReservations(
  establishmentId: string,
  limit: number = 10,
): Promise<RecentReservation[]> {
  try {
    const { data } = await api.get<RecentReservation[]>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/recent-reservations`,
      { params: { limit } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}