// service/superadmin/hotel/features/createFeature.ts

import api from "@/service/api";
import { CreateFeatureInput, Feature } from "@/shared/types/superadmin/feature";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function createFeature(
  input: CreateFeatureInput,
): Promise<Feature> {
  try {
    const { data } = await api.post<Feature>(
      "/api/superadmin/hotel/features",
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}