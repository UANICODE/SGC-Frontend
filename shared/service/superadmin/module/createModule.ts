// service/superadmin/hotel/modules/createModule.ts

import api from "@/service/api";
import { CreateModuleInput, Module } from "@/shared/types/superadmin/module";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function createModule(input: CreateModuleInput): Promise<Module> {
  try {
    const { data } = await api.post<Module>(
      "/api/superadmin/hotel/modules",
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}