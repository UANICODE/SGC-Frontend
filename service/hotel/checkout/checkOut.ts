// service/hotel/checkout/checkOut.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CheckOutInput, Reservation } from "@/types/hotel";

export async function checkOut(
  establishmentId: string,
  input: CheckOutInput,
): Promise<Reservation> {
  try {
    const { data } = await api.post<Reservation>(
      `/api/admin/hotel/establishments/${establishmentId}/checkout`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}