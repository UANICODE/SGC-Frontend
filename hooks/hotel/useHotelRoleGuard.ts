"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/enum/enum";
import { useHotelMode } from "@/providers/HotelModeProvider";
import { useAuth } from "@/shared/hooks/auth/useAuth";

export function useHotelRoleGuard(allowed: UserRole[]) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isHotel } = useHotelMode();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (!allowed.some((role) => user.roles.includes(role))) {
      router.replace("/");
      return;
    }

    if (!isHotel) {
      router.replace("/");
    }
  }, [user, loading, allowed, router, isHotel]);
}