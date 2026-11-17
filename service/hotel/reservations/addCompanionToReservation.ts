// service/hotel/reservations/addCompanionToReservation.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Reservation } from "@/types/hotel";

export async function addCompanionToReservation(
  establishmentId: string,
  reservationId: string,
  guestId: string,
): Promise<Reservation> {
  try {
    const { data } = await api.post<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations/${reservationId}/companions/${guestId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}