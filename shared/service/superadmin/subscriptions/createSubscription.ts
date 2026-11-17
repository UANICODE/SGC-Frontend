// service/superadmin/hotel/subscriptions/createSubscription.ts

import api from "@/service/api"
import { CreateSubscriptionInput, Subscription } from "@/shared/types/superadmin/subscription";
import { handleHttpError } from "@/utils/httpErrorHandler";
 

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<Subscription> {
  try {
    const { data } = await api.post<Subscription>(
      "/api/superadmin/hotel/subscriptions",
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}