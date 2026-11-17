// service/superadmin/hotel/features/listFeaturesByModule.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { Feature } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin";


export async function listFeaturesByModule(
  moduleId: string,
  active?: boolean,
): Promise<Feature[]> {
  try {
    const { data } = await api.get<Feature[]>(
      `/api/superadmin/hotel/modules/${moduleId}/features`,
      { params: active === undefined ? undefined : { active } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}