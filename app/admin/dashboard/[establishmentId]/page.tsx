"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHotelMode } from "@/providers/HotelModeProvider";

export default function AdminDashboardIndex() {
  const { isHotel } = useHotelMode();
  const params = useParams<{ establishmentId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!params.establishmentId) return;

    const target = isHotel
      ? `/admin/dashboard/${params.establishmentId}/hotel`
      : `/admin/dashboard/${params.establishmentId}/pos`;

    router.replace(target);
  }, [isHotel, params.establishmentId, router]);

  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">A redirecionar…</p>
      </div>
    </div>
  );
}