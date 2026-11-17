// types/hotel/roomType.ts

export interface RoomType {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  beds: number;
  basePricePerNight: number | null;
  basePricePerHour: number | null;
  active: boolean;
}

export interface CreateRoomTypeInput {
  name: string;
  description?: string;
  capacity: number;
  beds: number;
  basePricePerNight?: number | null;
  basePricePerHour?: number | null;
}