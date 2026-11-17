// types/superadmin/hotel/subscription.ts

import type { SubscriptionStatus } from "./common";

export interface Subscription {
  id: string;
  establishmentId: string;
  establishmentName: string;
  planId: string;
  planCode: string;
  planName: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  status: SubscriptionStatus;
  autoRenew: boolean;
  notes: string | null;
}

export interface CreateSubscriptionInput {
  establishmentId: string;
  planId: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  autoRenew?: boolean;
  notes?: string;
}

export interface UpdateSubscriptionInput {
  planId?: string;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
  notes?: string;
}