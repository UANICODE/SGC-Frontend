// types/hotel/reservation.ts

import type { ReservationStatusCode } from "./common";

export interface ReservationRoom {
  id: string;
  roomId: string;
  roomNumber: string;
  fromDate: string;
  toDate: string;
  periodUnitCode: string;
  periodCount: number;
  nightPrice: number;
  hourPrice: number | null; 
  subtotal: number;
  extraCharge: number;
}

export interface ReservationCompanion {
  id: string;
  guestId: string;
  guestFullName: string;
  relationship: string | null;
}

export interface Reservation {
  id: string;
  code: string;
  statusCode: ReservationStatusCode;
  statusName: string;
  guestId: string;
  guestFullName: string;
  checkInPlanned: string;
  checkOutPlanned: string;
  actualCheckIn: string | null;
  actualCheckOut: string | null;
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes: string | null;
  rooms: ReservationRoom[];
  companions: ReservationCompanion[];
}

export interface ReservationRoomInput {
  roomId: string;
  periodCount: number;
  periodUnitCode: string;
}

export interface CreateReservationInput {
  guestId: string;
  checkInPlanned: string;
  checkOutPlanned: string;
  adults: number;
  children: number;
  notes?: string;
  rooms: ReservationRoomInput[];
  companionGuestIds?: string[];
}

export interface UpdateReservationInput {
  checkInPlanned: string;
  checkOutPlanned: string;
  adults: number;
  children: number;
  notes?: string;
}

export interface AddRoomToReservationInput {
  roomId: string;
  periodCount: number;
  periodUnitId: string;
}