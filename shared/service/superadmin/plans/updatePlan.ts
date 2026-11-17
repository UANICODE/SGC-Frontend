// service/superadmin/hotel/plans/updatePlan.ts

import api from "@/service/api";
import { Plan, UpdatePlanInput } from "@/shared/types/superadmin/plan";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function updatePlan(
  planId: string,
  input: UpdatePlanInput,
): Promise<Plan> {
  try {
    const { data } = await api.put<Plan>(
      `/api/superadmin/hotel/plans/${planId}`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}