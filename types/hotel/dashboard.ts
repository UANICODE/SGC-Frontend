// types/hotel/dashboard.ts

export interface OccupancySummary {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  dirtyRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
}

export interface DashboardOverview {
  occupancy: OccupancySummary;
  todayRevenue: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  openCashSessions: number;
}

export interface RevenueByPaymentMethod {
  paymentMethodName: string;
  total: number;
}

export interface RevenueSummary {
  from: string;
  to: string;
  totalRevenue: number;
  byPaymentMethod: RevenueByPaymentMethod[];
}

export interface AdrRevPar {
  adr: number;
  revPar: number;
  nightsSold: number;
  availableRoomNights: number;
  totalRoomRevenue: number;
}

export interface OpenCashSessionSummary {
  sessionId: string;
  openedByUid: string;
  openedByName: string;
  openedAt: string;
  openingBalance: number;
  currentTotalIn: number;
  currentTotalOut: number;
}

export interface RecentMovement {
  id: string;
  movementTypeName: string;
  isInflow: boolean;
  amount: number;
  paymentMethodName: string | null;
  movementTime: string;
  registeredByName: string;
}

export interface RecentReservation {
  id: string;
  code: string;
  guestName: string;
  statusCode: string;
  statusName: string;
  createdAt: string;
  checkInPlanned: string;
  checkOutPlanned: string;
}

export interface ReservationStatusCount {
  statusCode: string;
  statusName: string;
  total: number;
}