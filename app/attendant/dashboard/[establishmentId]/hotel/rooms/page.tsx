"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BedDouble, Filter, RefreshCw } from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListRooms } from "@/hooks/hotel/rooms/useListRooms";
import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { ROOM_STATUS } from "@/types/hotel/catalogs";
import type { RoomStatusCode } from "@/types/hotel";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const FILTERS: Array<{ value: "" | RoomStatusCode; label: string }> = [
  { value: "", label: "Todos" },
  { value: "AVAILABLE", label: "Disponíveis" },
  { value: "OCCUPIED", label: "Ocupados" },
  { value: "DIRTY", label: "Sujos" },
  { value: "CLEANING", label: "Em limpeza" },
  { value: "MAINTENANCE", label: "Manutenção" },
];

export default function AttendantRoomsPage() {
  useHotelRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;

  const { data: rooms, loading, error, fetch } = useListRooms();
  const [filter, setFilter] = useState<"" | RoomStatusCode>("");

  const load = useCallback(async () => {
    await fetch(establishmentId, "attendant");
  }, [fetch, establishmentId]);

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return rooms;
    return rooms.filter((r) => r.statusCode === filter);
  }, [rooms, filter]);

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    rooms.forEach((r) => (acc[r.statusCode] = (acc[r.statusCode] ?? 0) + 1));
    return acc;
  }, [rooms]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <BedDouble size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Quartos</h1>
              <p className="text-sm text-gray-500">
                {rooms.length} quarto(s) no estabelecimento
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(ROOM_STATUS) as RoomStatusCode[]).map((code) => {
            const meta = ROOM_STATUS[code];
            return (
              <div
                key={code}
                className="rounded-xl bg-gray-50 px-3 py-2 text-center"
              >
                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                  {meta.label}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {counts[code] ?? 0}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                  active
                    ? "bg-primary text-white ring-primary"
                    : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && rooms.length === 0 ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">Nenhum quarto neste estado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((room) => {
            const meta = ROOM_STATUS[room.statusCode];
            return (
              <article
                key={room.id}
                className="flex flex-col rounded-2xl border border-borderLight bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Quarto
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {room.number}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {room.roomType.name} · {room.roomType.capacity} pax
                    </p>
                  </div>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500">
                    {currency.format(room.roomType.basePricePerNight ?? 0)} / noite
                  </p>
                  {room.floor && (
                    <p className="text-xs text-gray-500">Piso {room.floor}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}