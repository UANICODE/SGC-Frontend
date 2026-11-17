// service/superadmin/hotel/establishmentModules/listEstablishmentModules.ts

import api from "@/service/api";
import { EstablishmentModule } from "@/shared/types/superadmin/establishmentModule";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listEstablishmentModules(
  establishmentId: string,
): Promise<EstablishmentModule[]> {
  try {
    const { data } = await api.get<EstablishmentModule[]>(
      `/api/superadmin/hotel/establishments/${establishmentId}/modules`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}