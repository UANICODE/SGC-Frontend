// service/hotel/reservations/removeRoomFromReservation.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Reservation } from "@/types/hotel";

export async function removeRoomFromReservation(
  establishmentId: string,
  reservationId: string,
  reservationRoomId: string,
): Promise<Reservation> {
  try {
    const { data } = await api.delete<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations/${reservationId}/rooms/${reservationRoomId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}