// service/hotel/rooms/updateRoom.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Room, UpdateRoomInput } from "@/types/hotel";

export async function updateRoom(
  establishmentId: string,
  roomId: string,
  input: UpdateRoomInput,
): Promise<Room> {
  try {
    const { data } = await api.put<Room>(
      `/api/admin/hotel/establishments/${establishmentId}/rooms/${roomId}`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}