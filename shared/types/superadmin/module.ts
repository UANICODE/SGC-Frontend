// types/superadmin/hotel/module.ts

export interface Module {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
}

export interface CreateModuleInput {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateModuleInput {
  name: string;
  description?: string;
  active?: boolean;
}