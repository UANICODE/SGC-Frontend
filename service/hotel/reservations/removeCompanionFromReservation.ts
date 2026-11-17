// service/hotel/reservations/removeCompanionFromReservation.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Reservation } from "@/types/hotel";

export async function removeCompanionFromReservation(
  establishmentId: string,
  reservationId: string,
  companionId: string,
): Promise<Reservation> {
  try {
    const { data } = await api.delete<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations/${reservationId}/companions/${companionId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}