import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { HotelApiRole, Reservation } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function cancelReservation(
  establishmentId: string,
  reservationId: string,
  role: HotelApiRole = "admin",
): Promise<Reservation> {
  try {
    const { data } = await api.post<Reservation>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/reservations/${reservationId}/cancel`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}