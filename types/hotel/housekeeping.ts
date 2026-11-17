// types/hotel/housekeeping.ts

import type { HousekeepingStatusCode } from "./common";

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  assignedToUid: string | null;
  assignedToName: string | null;
  statusCode: HousekeepingStatusCode;
  statusName: string;
  taskCreatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  notes: string | null;
}

export interface CreateHousekeepingTaskInput {
  roomId: string;
  assignedToUserUid?: string;
  notes?: string;
}

export interface AssignHousekeepingTaskInput {
  assignedToUserUid: string;
}

export interface CompleteHousekeepingTaskInput {
  notes?: string;
}