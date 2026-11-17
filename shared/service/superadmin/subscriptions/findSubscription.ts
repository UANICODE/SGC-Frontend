// service/superadmin/hotel/subscriptions/findSubscription.ts

import api from "@/service/api";
import { Subscription } from "@/shared/types/superadmin/subscription";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function findSubscription(
  subscriptionId: string,
): Promise<Subscription> {
  try {
    const { data } = await api.get<Subscription>(
      `/api/superadmin/hotel/subscriptions/${subscriptionId}`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}