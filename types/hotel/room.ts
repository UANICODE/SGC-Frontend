// types/hotel/room.ts

import type { RoomStatusCode } from "./common";

export interface RoomTypeSummary {
  id: string;
  name: string;
  capacity: number;
  basePricePerNight: number | null;
  basePricePerHour: number | null;
}

export interface Room {
  id: string;
  number: string;
  floor: string | null;
  location: string | null;
  statusCode: RoomStatusCode;
  statusName: string;
  roomType: RoomTypeSummary;
  active: boolean;
  notes: string | null;
}

export interface CreateRoomInput {
  roomTypeId: string;
  number: string;
  floor?: string;
  location?: string;
  notes?: string;
}

export interface UpdateRoomInput {
  roomTypeId: string;
  number: string;
  floor?: string;
  location?: string;
  notes?: string;
}