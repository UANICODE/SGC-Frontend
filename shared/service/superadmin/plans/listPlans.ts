// service/superadmin/hotel/plans/listPlans.ts

import api from "@/service/api";
import { Plan } from "@/shared/types/superadmin/plan";
import { handleHttpError } from "@/utils/httpErrorHandler";


interface ListPlansParams {
  active?: boolean;
  moduleId?: string;
}

export async function listPlans(params?: ListPlansParams): Promise<Plan[]> {
  try {
    const { data } = await api.get<Plan[]>("/api/superadmin/hotel/plans", {
      params,
    });
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}