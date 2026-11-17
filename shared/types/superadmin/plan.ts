// types/superadmin/hotel/plan.ts

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  durationDays: number;
  displayOrder: number;
  active: boolean;
  moduleId: string | null;
  moduleIds: string[];
  featureIds: string[];
}

export interface CreatePlanInput {
  code: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  durationDays: number;
  displayOrder: number;
  moduleId: string;
  moduleIds?: string[];
  featureIds?: string[];
}

export interface UpdatePlanInput {
  name: string;
  description?: string;
  monthlyPrice: number;
  durationDays: number;
  displayOrder: number;
  active?: boolean;
}