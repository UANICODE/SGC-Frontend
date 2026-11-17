import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Guest, HotelApiRole } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function searchGuests(
  establishmentId: string,
  term?: string,
  role: HotelApiRole = "admin",
): Promise<Guest[]> {
  try {
    const { data } = await api.get<Guest[]>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/guests`,
      { params: term ? { term } : undefined },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}