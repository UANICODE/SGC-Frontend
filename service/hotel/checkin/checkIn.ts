// service/hotel/checkin/checkIn.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CheckInInput, Reservation } from "@/types/hotel";

export async function checkIn(
  establishmentId: string,
  input: CheckInInput,
): Promise<Reservation> {
  try {
    const { data } = await api.post<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/checkin`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}