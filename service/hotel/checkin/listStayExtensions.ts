// service/hotel/extensions/listStayExtensions.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { StayExtension } from "@/types/hotel";

export async function listStayExtensions(
  establishmentId: string,
  reservationRoomId: string,
): Promise<StayExtension[]> {
  try {
    const { data } = await api.get<StayExtension[]>(
      `/api/admin/hotel/establishments/${establishmentId}/reservation-rooms/${reservationRoomId}/extensions`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}