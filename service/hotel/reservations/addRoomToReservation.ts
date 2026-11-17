// service/hotel/reservations/addRoomToReservation.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { AddRoomToReservationInput, Reservation } from "@/types/hotel";

export async function addRoomToReservation(
  establishmentId: string,
  reservationId: string,
  input: AddRoomToReservationInput,
): Promise<Reservation> {
  try {
    const { data } = await api.post<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations/${reservationId}/rooms`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}