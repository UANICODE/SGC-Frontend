// types/superadmin/hotel/establishmentModule.ts

import type { ModuleSource } from "./common";

export interface EstablishmentModule {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  source: ModuleSource;
  enabled: boolean;
}

export interface AssignModuleInput {
  moduleCode: string;
  enabled: boolean;
}