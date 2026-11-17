// service/superadmin/hotel/modules/updateModule.ts

import api from "@/service/api";
import { Module, UpdateModuleInput } from "@/shared/types/superadmin";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function updateModule(
  moduleId: string,
  input: UpdateModuleInput,
): Promise<Module> {
  try {
    const { data } = await api.put<Module>(
      `/api/superadmin/hotel/modules/${moduleId}`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}