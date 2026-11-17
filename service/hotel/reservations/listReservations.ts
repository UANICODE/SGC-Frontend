// service/hotel/reservations/listReservations.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { Reservation } from "@/types/hotel";

export async function listReservations(
  establishmentId: string,
  statusId?: string,
): Promise<Reservation[]> {
  try {
    const { data } = await api.get<Reservation[]>(
      `/api/admin/hotel/establishments/${establishmentId}/reservations`,
      { params: statusId ? { statusId } : undefined },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}