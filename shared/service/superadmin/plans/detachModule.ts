// service/superadmin/hotel/plans/detachModule.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function detachModuleFromPlan(
  planId: string,
  moduleId: string,
): Promise<void> {
  try {
    await api.delete(
      `/api/superadmin/hotel/plans/${planId}/modules/${moduleId}`,
    );
  } catch (error) {
    handleHttpError(error);
  }
}