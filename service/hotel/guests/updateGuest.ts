import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Guest, HotelApiRole, UpdateGuestInput } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function updateGuest(
  establishmentId: string,
  guestId: string,
  input: UpdateGuestInput,
  role: HotelApiRole = "admin",
): Promise<Guest> {
  try {
    const { data } = await api.put<Guest>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/guests/${guestId}`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}