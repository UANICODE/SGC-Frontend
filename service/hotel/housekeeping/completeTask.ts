// service/hotel/housekeeping/completeTask.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { CompleteHousekeepingTaskInput, HousekeepingTask } from "@/types/hotel";

export async function completeHousekeepingTask(
  establishmentId: string,
  taskId: string,
  input?: CompleteHousekeepingTaskInput,
): Promise<HousekeepingTask> {
  try {
    const { data } = await api.post<HousekeepingTask>(
      `/api/admin/hotel/establishments/${establishmentId}/housekeeping/tasks/${taskId}/complete`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}