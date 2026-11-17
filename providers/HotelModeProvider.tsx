"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

const HOTEL_BUSINESS_TYPES = new Set(["HOTEL", "GUESTHOUSE"]);

interface HotelModeValue {
  isHotel: boolean;
  businessTypeCode: string | null;
}

const HotelModeContext = createContext<HotelModeValue | null>(null);

interface HotelModeProviderProps {
  businessTypeCode: string | null;
  children: ReactNode;
}

export function HotelModeProvider({
  businessTypeCode,
  children,
}: HotelModeProviderProps) {
  const value = useMemo<HotelModeValue>(
    () => ({
      isHotel: businessTypeCode !== null && HOTEL_BUSINESS_TYPES.has(businessTypeCode),
      businessTypeCode,
    }),
    [businessTypeCode],
  );

  return (
    <HotelModeContext.Provider value={value}>
      {children}
    </HotelModeContext.Provider>
  );
}

export function useHotelMode(): HotelModeValue {
  const ctx = useContext(HotelModeContext);
  if (!ctx) {
    throw new Error("useHotelMode deve ser usado dentro de HotelModeProvider");
  }
  return ctx;
}