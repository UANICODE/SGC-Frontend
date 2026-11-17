// service/superadmin/hotel/subscriptions/listSubscriptions.ts

import api from "@/service/api";
import { SubscriptionStatus } from "@/shared/types/superadmin/common";
import { Subscription } from "@/shared/types/superadmin/subscription";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listSubscriptions(
  status?: SubscriptionStatus,
): Promise<Subscription[]> {
  try {
    const { data } = await api.get<Subscription[]>(
      "/api/superadmin/hotel/subscriptions",
      { params: status ? { status } : undefined },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}