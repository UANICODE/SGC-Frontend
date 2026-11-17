// types/superadmin/hotel/common.ts

export type SubscriptionStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "SUSPENDED";

export type ModuleSource = "PLAN" | "OVERRIDE" | "BUSINESS_TYPE";