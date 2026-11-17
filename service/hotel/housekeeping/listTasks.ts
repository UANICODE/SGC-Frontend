// service/hotel/housekeeping/listTasks.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { HousekeepingTask } from "@/types/hotel";

export async function listHousekeepingTasks(
  establishmentId: string,
  statusCode: string = "PENDING",
): Promise<HousekeepingTask[]> {
  try {
    const { data } = await api.get<HousekeepingTask[]>(
      `/api/admin/hotel/establishments/${establishmentId}/housekeeping/tasks`,
      { params: { statusCode } },
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}