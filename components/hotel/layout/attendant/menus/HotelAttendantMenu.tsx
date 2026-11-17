"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  HomeModernIcon,
  CalendarDaysIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface HotelAttendantMenuProps {
  basePath: string;
  collapsed?: boolean;
  isActive?: (href: string) => boolean;
}

export function HotelAttendantMenu({
  basePath,
}: HotelAttendantMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const prefix = `${basePath}/hotel`;

  // Marca o "Recepção" como isRoot: só fica ativo quando pathname === prefix.
  const menu = [
    {
      label: "Recepção",
      path: `${prefix}`,
      isRoot: true,
      icon: <Squares2X2Icon className="w-5 h-5" />,
    },
    {
      label: "Quartos",
      path: `${prefix}/rooms`,
      icon: <HomeModernIcon className="w-5 h-5" />,
    },
    {
      label: "Reservas",
      path: `${prefix}/reservations`,
      icon: <CalendarDaysIcon className="w-5 h-5" />,
    },
  
    {
      label: "Check-in",
      path: `${prefix}/checkin`,
      icon: <ArrowLeftOnRectangleIcon className="w-5 h-5" />,
    },
    {
      label: "Check-out",
      path: `${prefix}/checkout`,
      icon: <ArrowRightOnRectangleIcon className="w-5 h-5" />,
    },
    {
      label: "Caixa",
      path: `${prefix}/cash`,
      icon: <BanknotesIcon className="w-5 h-5" />,
    },
  ];

  const isMenuActive = (path: string, isRoot: boolean) => {
    if (isRoot) return pathname === path;
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      {menu.map((item) => {
        const active = isMenuActive(item.path, !!item.isRoot);
        const isHovered = hoveredItem === item.label;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`
              group relative flex items-center gap-3 px-4 py-2.5 rounded-xl
              transition-all duration-300 overflow-hidden
              ${
                active
                  ? "text-white font-medium shadow-lg"
                  : "text-white/70 hover:text-white"
              }
            `}
            style={
              active
                ? {
                    background: `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))`,
                    boxShadow: `0 4px 15px rgba(0,0,0,0.2)`,
                  }
                : {}
            }
          >
            {!active && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
                }}
              />
            )}

            <div
              className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${
                active ? "text-white" : "text-white/70"
              }`}
            >
              {item.icon}
            </div>

            <span className="relative z-10 font-medium">{item.label}</span>

            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
            )}

            {active && (
              <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </>
  );
}