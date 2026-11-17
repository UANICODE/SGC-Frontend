// types/hotel/common.ts

export type HotelApiRole = "admin" | "attendant";

export type RoomStatusCode =
  | "AVAILABLE"
  | "OCCUPIED"
  | "DIRTY"
  | "CLEANING"
  | "MAINTENANCE";

export type ReservationStatusCode =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export type StayPeriodUnitCode = "HOURS" | "DAYS" | "WEEKS" | "MONTHS" | "YEARS";

export type HousekeepingStatusCode =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type CashMovementTypeCode =
  | "RESERVATION_DEPOSIT"
  | "CHECKIN_PAYMENT"
  | "STAY_EXTENSION_PAYMENT"
  | "CHECKOUT_PAYMENT"
  | "EXTRA_CONSUMPTION"
  | "MANUAL_IN"
  | "DAILY_EXPENSE"
  | "WITHDRAWAL"
  | "REFUND"
  | "MANUAL_OUT";

export type DocumentType = "BI" | "PASSPORT";