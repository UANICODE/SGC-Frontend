// service/hotel/rooms/listRooms.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { HotelApiRole, Room } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function listRooms(
  establishmentId: string,
  role: HotelApiRole,
): Promise<Room[]> {
  try {
    const { data } = await api.get<Room[]>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/rooms`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}