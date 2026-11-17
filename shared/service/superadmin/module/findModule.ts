// service/superadmin/hotel/modules/findModule.ts

import api from "@/service/api";
import { Module } from "@/shared/types/superadmin/module";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function findModule(moduleId: string): Promise<Module> {
  try {
    const { data } = await api.get<Module>(
      `/api/superadmin/hotel/modules/${moduleId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}