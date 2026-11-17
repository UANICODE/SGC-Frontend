// service/hotel/housekeeping/assignTask.ts

import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { AssignHousekeepingTaskInput, HousekeepingTask } from "@/types/hotel";

export async function assignHousekeepingTask(
  establishmentId: string,
  taskId: string,
  input: AssignHousekeepingTaskInput,
): Promise<HousekeepingTask> {
  try {
    const { data } = await api.put<HousekeepingTask>(
      `/api/admin/hotel/establishments/${establishmentId}/housekeeping/tasks/${taskId}/assign`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}