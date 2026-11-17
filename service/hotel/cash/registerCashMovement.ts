// service/hotel/cash/registerCashMovement.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CashMovement, RegisterCashMovementInput } from "@/types/hotel";

export async function registerCashMovement(
  establishmentId: string,
  input: RegisterCashMovementInput,
): Promise<CashMovement> {
  try {
    const { data } = await api.post<CashMovement>(
      `/api/admin/hotel/establishments/${establishmentId}/cash-sessions/movements`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}