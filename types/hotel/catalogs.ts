// types/hotel/catalogs.ts

import type {
  CashMovementTypeCode,
  HousekeepingStatusCode,
  ReservationStatusCode,
  RoomStatusCode,
  StayPeriodUnitCode,
} from "./common";

type BadgeTone = "success" | "warning" | "danger" | "neutral" | "info";

interface CatalogEntry {
  label: string;
  tone: BadgeTone;
}

export const ROOM_STATUS: Record<RoomStatusCode, CatalogEntry> = {
  AVAILABLE:   { label: "Disponível", tone: "success" },
  OCCUPIED:    { label: "Ocupado",    tone: "info"    },
  DIRTY:       { label: "Sujo",       tone: "warning" },
  CLEANING:    { label: "Em limpeza", tone: "info"    },
  MAINTENANCE: { label: "Manutenção", tone: "danger"  },
};

export const RESERVATION_STATUS: Record<ReservationStatusCode, CatalogEntry> = {
  PENDING:     { label: "Pendente",   tone: "neutral" },
  CONFIRMED:   { label: "Confirmada", tone: "info"    },
  CHECKED_IN:  { label: "Check-in",   tone: "success" },
  CHECKED_OUT: { label: "Check-out",  tone: "neutral" },
  CANCELLED:   { label: "Cancelada",  tone: "danger"  },
  NO_SHOW:     { label: "No-show",    tone: "warning" },
};

export const STAY_PERIOD_UNIT: Record<StayPeriodUnitCode, { label: string }> = {
  HOURS:  { label: "Horas"   },
  DAYS:   { label: "Dias"    },
  WEEKS:  { label: "Semanas" },
  MONTHS: { label: "Meses"   },
  YEARS:  { label: "Anos"    },
};

export const HOUSEKEEPING_STATUS: Record<HousekeepingStatusCode, CatalogEntry> = {
  PENDING:     { label: "Pendente",  tone: "neutral" },
  IN_PROGRESS: { label: "Em curso",  tone: "info"    },
  COMPLETED:   { label: "Concluída", tone: "success" },
  CANCELLED:   { label: "Cancelada", tone: "danger"  },
};

interface CashMovementEntry {
  label: string;
  inflow: boolean;
  requiresPaymentMethod: boolean;
}

export const CASH_MOVEMENT_TYPE: Record<CashMovementTypeCode, CashMovementEntry> = {
  RESERVATION_DEPOSIT:    { label: "Adiantamento de reserva", inflow: true,  requiresPaymentMethod: true  },
  CHECKIN_PAYMENT:        { label: "Pagamento no check-in",   inflow: true,  requiresPaymentMethod: true  },
  STAY_EXTENSION_PAYMENT: { label: "Pagamento de extensão",   inflow: true,  requiresPaymentMethod: true  },
  CHECKOUT_PAYMENT:       { label: "Pagamento no check-out",  inflow: true,  requiresPaymentMethod: true  },
  EXTRA_CONSUMPTION:      { label: "Consumo extra",           inflow: true,  requiresPaymentMethod: true  },
  MANUAL_IN:              { label: "Entrada manual",          inflow: true,  requiresPaymentMethod: true  },
  DAILY_EXPENSE:          { label: "Despesa do dia",          inflow: false, requiresPaymentMethod: false },
  WITHDRAWAL:             { label: "Sangria",                 inflow: false, requiresPaymentMethod: false },
  REFUND:                 { label: "Reembolso",               inflow: false, requiresPaymentMethod: false },
  MANUAL_OUT:             { label: "Saída manual",            inflow: false, requiresPaymentMethod: false },
};