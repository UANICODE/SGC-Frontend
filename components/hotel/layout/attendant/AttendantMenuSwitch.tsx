"use client";

import { useParams } from "next/navigation";
import { useHotelMode } from "@/providers/HotelModeProvider";
import { HotelAttendantMenu } from "./menus/HotelAttendantMenu";

interface AttendantMenuSwitchProps {
  collapsed: boolean;
  isActive: (href: string) => boolean;
  children: React.ReactNode;
}

export function AttendantMenuSwitch({
  collapsed,
  isActive,
  children,
}: AttendantMenuSwitchProps) {
  const { isHotel } = useHotelMode();
  const params = useParams<{ establishmentId: string }>();

  if (isHotel && params.establishmentId) {
    return (
      <HotelAttendantMenu
        basePath={`/attendant/dashboard/${params.establishmentId}`}
        collapsed={collapsed}
        isActive={isActive}
      />
    );
  }

  return <>{children}</>;
}