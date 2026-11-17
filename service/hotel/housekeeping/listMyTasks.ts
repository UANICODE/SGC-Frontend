// service/hotel/housekeeping/listMyTasks.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { HousekeepingTask } from "@/types/hotel";

export async function listMyHousekeepingTasks(
  establishmentId: string,
  statusCode: string = "PENDING",
): Promise<HousekeepingTask[]> {
  try {
    const { data } = await api.get<HousekeepingTask[]>(
      `/api/admin/hotel/establishments/${establishmentId}/housekeeping/my-tasks`,
      { params: { statusCode } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}