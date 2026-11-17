// service/hotel/housekeeping/createTask.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CreateHousekeepingTaskInput, HousekeepingTask } from "@/types/hotel";

export async function createHousekeepingTask(
  establishmentId: string,
  input: CreateHousekeepingTaskInput,
): Promise<HousekeepingTask> {
  try {
    const { data } = await api.post<HousekeepingTask>(
      `/api/admin/hotel/establishments/${establishmentId}/housekeeping/tasks`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}