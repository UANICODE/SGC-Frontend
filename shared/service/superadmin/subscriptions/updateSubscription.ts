// service/superadmin/hotel/subscriptions/updateSubscription.ts

import api from "@/service/api";
import { Subscription, UpdateSubscriptionInput } from "@/shared/types/superadmin/subscription";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function updateSubscription(
  subscriptionId: string,
  input: UpdateSubscriptionInput,
): Promise<Subscription> {
  try {
    const { data } = await api.put<Subscription>(
      `/api/superadmin/hotel/subscriptions/${subscriptionId}`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}