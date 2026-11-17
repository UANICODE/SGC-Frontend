import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Guest, HotelApiRole } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function findGuestById(
  establishmentId: string,
  guestId: string,
  role: HotelApiRole = "admin",
): Promise<Guest> {
  try {
    const { data } = await api.get<Guest>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/guests/${guestId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}