// types/hotel/cash.ts

export interface CashSession {
  id: string;
  businessDate: string;
  openingBalance: number;
  totalIn: number;
  totalOut: number;
  closingBalance: number | null;
  openedAt: string;
  closedAt: string | null;
  openedByUid: string;
  openedByName: string;
  closedByUid: string | null;
  closedByName: string | null;
  closed: boolean;
  closingNotes: string | null;
}

export interface PaymentMethodSummary {
  paymentMethodName: string;
  totalIn: number;
  totalOut: number;
}

export interface CashSessionSummary {
  session: CashSession;
  summaryByPaymentMethod: PaymentMethodSummary[];
}

export interface OpenCashSessionInput {
  openingBalance: number;
}

export interface CloseCashSessionInput {
  sessionId: string;
  closingNotes?: string;
}

export interface RegisterCashMovementInput {
 movementTypeCode: string;
  amount: number;
  paymentMethodId?: string;
  reservationId?: string;
  description?: string;
}

export interface CashMovement {
  id: string;
  sessionId: string;
  movementTypeCode: string;
  movementTypeName: string;
  isInflow: boolean;
  amount: number;
  paymentMethodName: string | null;
  reservationId: string | null;
  movementTime: string;
  description: string | null;
  registeredByUid: string;
}