// types/superadmin/hotel/feature.ts

export interface Feature {
  id: string;
  moduleId: string;
  moduleCode: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  active: boolean;
}

export interface CreateFeatureInput {
  moduleId: string;
  code: string;
  name: string;
  description?: string;
  category: string;
}