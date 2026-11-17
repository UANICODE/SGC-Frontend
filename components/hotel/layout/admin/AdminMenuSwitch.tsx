"use client";

import { useParams } from "next/navigation";
import { useHotelMode } from "@/providers/HotelModeProvider";
import { HotelAdminMenu } from "./menus/HotelAdminMenu";

interface AdminMenuSwitchProps {
  collapsed: boolean;
  isActive: (href: string) => boolean; // 👈 Adicionado
  /** O menu POS que já existe (passa o componente atual como children) */
  children: React.ReactNode;
}

export function AdminMenuSwitch({ collapsed, isActive, children }: AdminMenuSwitchProps) {
  const { isHotel } = useHotelMode();
  const params = useParams<{ establishmentId: string }>();

  if (isHotel && params.establishmentId) {
    return (
      <HotelAdminMenu
        establishmentId={params.establishmentId}
        basePath={`/admin/dashboard/${params.establishmentId}`}
        collapsed={collapsed}
        isActive={isActive} // 👈 Passado para o menu
      />
    );
  }

  return <>{children}</>;
}