"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  DoorOpen,
  DoorClosed,
  LayoutDashboard,
  Wallet,
  Users,           // 👈 já tens este ícone, garantido
} from "lucide-react";

interface HotelAdminMenuProps {
  establishmentId: string;
  basePath: string;
  collapsed: boolean;
  isActive?: (href: string) => boolean;
}

export function HotelAdminMenu({ basePath, collapsed }: HotelAdminMenuProps) {
  const pathname = usePathname();
  const prefix = `${basePath}/hotel`;

  const items = [
    { name: "Dashboard", href: `${prefix}`, isRoot: true, icon: <LayoutDashboard size={18} /> },
    { name: "Quartos", href: `${prefix}/rooms`, icon: <BedDouble size={18} /> },
    { name: "Reservas", href: `${prefix}/reservations`, icon: <CalendarCheck size={18} /> },
    { name: "Hóspedes", href: `${prefix}/guests`, icon: <Users size={18} /> },
    { name: "Check-in", href: `${prefix}/checkin`, icon: <DoorOpen size={18} /> },
    { name: "Check-out", href: `${prefix}/checkout`, icon: <DoorClosed size={18} /> },
    { name: "Caixa", href: `${prefix}/cash`, icon: <Wallet size={18} /> },
    // 👇 NOVO: Usuários — reutiliza o ecrã do POS
    { name: "Usuários", href: `${basePath}/users`, icon: <Users size={18} /> },
  ];

  const isMenuActive = (path: string, isRoot: boolean) => {
    if (isRoot) return pathname === path;
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="flex flex-col gap-2 text-sm">
      {items.map((item) => {
        const active = isMenuActive(item.href, !!item.isRoot);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-300 relative
              ${active ? "bg-primary/10 font-bold text-primary" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
            )}
            {item.icon}
            <span
              className={`transition-all duration-300 whitespace-pre ${
                !collapsed ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 overflow-hidden lg:max-w-xs"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}