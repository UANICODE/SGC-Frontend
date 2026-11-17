// service/superadmin/hotel/establishmentModules/assignModule.ts

import api from "@/service/api";
import { AssignModuleInput } from "@/shared/types/superadmin/establishmentModule";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function assignModuleToEstablishment(
  establishmentId: string,
  input: AssignModuleInput,
): Promise<void> {
  try {
    await api.put(
      `/api/superadmin/hotel/establishments/${establishmentId}/modules`,
      input,
    );
  } catch (error) {
    handleHttpError(error);
  }
}