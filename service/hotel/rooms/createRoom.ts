// service/hotel/rooms/createRoom.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CreateRoomInput, Room } from "@/types/hotel";

export async function createRoom(
  establishmentId: string,
  input: CreateRoomInput,
): Promise<Room> {
  try {
    const { data } = await api.post<Room>(
      `/api/admin/hotel/establishments/${establishmentId}/rooms`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}