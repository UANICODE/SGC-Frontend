"use client";

import { EstablishmentBlockProvider } from "@/providers/EstablishmentBlockProvider";
import { HotelModeProvider } from "@/providers/HotelModeProvider";
import { useParams } from "next/navigation";
import { DashboardFooter } from "@/components/ui/DashboardFooter";
import { useLoggedEstablishment } from "@/shared/hooks/auth/useLoggedEstablishment";
import { AdminSidebar } from "@/components/restaurant/admin/layout/AdminSidebar";
import { AdminNavbar } from "@/components/restaurant/admin/layout/AdminNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const establishmentId = Array.isArray(params?.establishmentId)
    ? params.establishmentId[0]
    : params?.establishmentId;

  // 👇 EXTRAIR O LOADING
  const { data, loading } = useLoggedEstablishment(establishmentId ?? "");

  // 👇 ENQUANTO CARREGA, MOSTRAR UM LOADER (ou um skeleton)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-backgroundLight">
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">A carregar ...</p>
        </div>
      </div>
    );
  }

  return (
    <EstablishmentBlockProvider>
      <HotelModeProvider businessTypeCode={data?.businessTypeCode ?? null}>
        <div
          className="flex h-screen bg-backgroundLight"
          style={{
            "--color-primary": data?.primaryColor || "#1F2937",
            "--color-secondary": data?.secondaryColor || "#4B5563",
          } as React.CSSProperties}
        >
          <AdminSidebar logo={data?.logoUrl} name={data?.tradeName} />
          <div className="flex-1 flex flex-col">
            <AdminNavbar logo={data?.logoUrl} name={data?.tradeName} />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
            <DashboardFooter version="v1.0.3" />
          </div>
        </div>
      </HotelModeProvider>
    </EstablishmentBlockProvider>
  );
}