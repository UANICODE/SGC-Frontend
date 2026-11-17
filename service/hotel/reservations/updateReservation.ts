// service/hotel/reservations/updateReservation.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Reservation, UpdateReservationInput } from "@/types/hotel";

export async function updateReservation(
  establishmentId: string,
  reservationId: string,
  input: UpdateReservationInput,
): Promise<Reservation> {
  try {
    const { data } = await api.put<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations/${reservationId}`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}