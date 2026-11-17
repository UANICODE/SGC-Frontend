// service/hotel/roomTypes/listRoomTypes.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { RoomType } from "@/types/hotel";

export async function listRoomTypes(establishmentId: string): Promise<RoomType[]> {
  try {
    const { data } = await api.get<RoomType[]>(
      `/api/admin/hotel/establishments/${establishmentId}/room-types`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}