// service/superadmin/hotel/subscriptions/cancelSubscription.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function cancelSubscription(
  subscriptionId: string,
): Promise<void> {
  try {
    await api.delete(`/api/superadmin/hotel/subscriptions/${subscriptionId}`);
  } catch (error) {
    handleHttpError(error);
  }
}