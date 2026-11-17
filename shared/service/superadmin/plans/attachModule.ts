// service/superadmin/hotel/plans/attachModule.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function attachModuleToPlan(
  planId: string,
  moduleId: string,
): Promise<void> {
  try {
    await api.post(
      `/api/superadmin/hotel/plans/${planId}/modules/${moduleId}`,
    );
  } catch (error) {
    handleHttpError(error);
  }
}