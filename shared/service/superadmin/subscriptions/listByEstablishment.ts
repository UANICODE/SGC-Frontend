// service/superadmin/hotel/subscriptions/listByEstablishment.ts

import api from "@/service/api";
import { Subscription } from "@/shared/types/superadmin/subscription";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listSubscriptionsByEstablishment(
  establishmentId: string,
): Promise<Subscription[]> {
  try {
    const { data } = await api.get<Subscription[]>(
      `/api/superadmin/hotel/establishments/${establishmentId}/subscriptions`,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}