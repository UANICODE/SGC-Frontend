// service/superadmin/hotel/plans/createPlan.ts

import api from "@/service/api";
import { CreatePlanInput } from "@/shared/types/superadmin/plan";
import { Plan } from "@/shared/types/superadmin/plan";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function createPlan(input: CreatePlanInput): Promise<Plan> {
  try {
    const { data } = await api.post<Plan>(
      "/api/superadmin/hotel/plans",
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}