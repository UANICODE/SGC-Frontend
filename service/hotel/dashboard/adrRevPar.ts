// service/hotel/dashboard/adrRevPar.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { AdrRevPar } from "@/types/hotel";

export async function fetchAdrRevPar(
  establishmentId: string,
  from: string,
  to: string,
): Promise<AdrRevPar> {
  try {
    const { data } = await api.get<AdrRevPar>(
      `/api/admin/hotel/establishments/${establishmentId}/dashboard/adr-revpar`,
      { params: { from, to } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}