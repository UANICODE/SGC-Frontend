import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { HotelApiRole, Room } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function listAvailableRooms(
  establishmentId: string,
  from: string,
  to: string,
  role: HotelApiRole = "admin",
): Promise<Room[]> {
  try {
    const { data } = await api.get<Room[]>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/rooms/available`,
      { params: { from, to } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}