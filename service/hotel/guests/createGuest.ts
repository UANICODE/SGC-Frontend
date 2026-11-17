import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CreateGuestInput, Guest, HotelApiRole } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function createGuest(
  establishmentId: string,
  input: CreateGuestInput,
  role: HotelApiRole = "admin",
): Promise<Guest> {
  try {
    const { data } = await api.post<Guest>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/guests`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}