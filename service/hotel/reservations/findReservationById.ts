// service/hotel/reservations/findReservationById.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Reservation } from "@/types/hotel";

export async function findReservationById(
  establishmentId: string,
  reservationId: string,
): Promise<Reservation> {
  try {
    const { data } = await api.get<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations/${reservationId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}