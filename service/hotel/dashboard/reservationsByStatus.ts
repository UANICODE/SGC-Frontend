// service/hotel/dashboard/reservationsByStatus.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { ReservationStatusCount } from "@/types/hotel";

export async function fetchReservationsByStatus(
  establishmentId: string,
): Promise<ReservationStatusCount[]> {
  try {
    const { data } = await api.get<ReservationStatusCount[]>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/reservations-by-status`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}