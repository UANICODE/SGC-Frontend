// types/hotel/checkin.ts

export interface CheckInInput {
  reservationId: string;
}

export interface ExtendStayInput {
  reservationRoomId: string;
  additionalPeriodCount: number;
  periodUnitCode: string;
  reason?: string;
}

export interface StayExtension {
  id: string;
  reservationRoomId: string;
  roomId: string;
  roomNumber: string;
  oldCheckOut: string;
  newCheckOut: string;
  extraAmount: number;
  reason: string | null;
  authorizedByUid: string;
}