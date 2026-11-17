import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CreateReservationInput, HotelApiRole, Reservation } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function createReservation(
  establishmentId: string,
  input: CreateReservationInput,
  role: HotelApiRole = "admin",
): Promise<Reservation> {
  try {
    const { data } = await api.post<Reservation>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/reservations`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}