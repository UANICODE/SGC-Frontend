// service/hotel/roomTypes/createRoomType.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CreateRoomTypeInput, RoomType } from "@/types/hotel";

export async function createRoomType(
  establishmentId: string,
  input: CreateRoomTypeInput,
): Promise<RoomType> {
  try {
    const { data } = await api.post<RoomType>(
      `/api/admin/hotel/establishments/${establishmentId}/room-types`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}