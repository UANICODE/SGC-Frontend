// service/superadmin/hotel/modules/listModules.ts

import api from "@/service/api";
import { Module } from "@/shared/types/superadmin";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listModules(): Promise<Module[]> {
  try {
    const { data } = await api.get<Module[]>("/api/superadmin/hotel/modules");
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}