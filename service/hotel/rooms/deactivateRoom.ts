// service/hotel/rooms/deactivateRoom.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function deactivateRoom(
  establishmentId: string,
  roomId: string,
): Promise<void> {
  try {
    await api.delete(
      `/api/admin/hotel/establishments/${establishmentId}/rooms/${roomId}`,
    );
  } catch (error) {
    handleHttpError(error);
  }
}