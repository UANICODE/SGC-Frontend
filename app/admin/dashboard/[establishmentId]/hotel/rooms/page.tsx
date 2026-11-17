"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  BedDouble,
  Building2,
  Filter,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListRooms } from "@/hooks/hotel/rooms/useListRooms";
import { useListRoomTypes } from "@/hooks/hotel/roomTypes/useListRoomTypes";
import { useDeactivateRoom } from "@/hooks/hotel/rooms/useDeactivateRoom";

import { useToast } from "@/ context/ToastContext";
import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { ConfirmDialog } from "@/components/hotel/shared/ConfirmDialog";
import { HotelRoomFormModal } from "@/components/hotel/rooms/HotelRoomFormModal";
import { HotelRoomTypeFormModal } from "@/components/hotel/rooms/HotelRoomTypeFormModal";

import { ROOM_STATUS } from "@/types/hotel/catalogs";
import type { Room, RoomStatusCode } from "@/types/hotel";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const STATUS_FILTERS: Array<{ value: "" | RoomStatusCode; label: string }> = [
  { value: "", label: "Todos" },
  { value: "AVAILABLE", label: "Disponíveis" },
  { value: "OCCUPIED", label: "Ocupados" },
  { value: "DIRTY", label: "Sujos" },
  { value: "CLEANING", label: "Em limpeza" },
  { value: "MAINTENANCE", label: "Manutenção" },
];

export default function HotelRoomsPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();

  const { data: rooms, loading, error, fetch: loadRooms } = useListRooms();
  const { data: roomTypes, fetch: loadRoomTypes } = useListRoomTypes();
  const { remove: deactivateRoom, loading: deactivating } = useDeactivateRoom();

  const [statusFilter, setStatusFilter] = useState<"" | RoomStatusCode>("");
  const [roomFormOpen, setRoomFormOpen] = useState(false);
  const [roomTypeFormOpen, setRoomTypeFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Room | null>(null);

  const load = useCallback(async () => {
    await Promise.all([
      loadRooms(establishmentId, "admin"),
      loadRoomTypes(establishmentId),
    ]);
  }, [establishmentId, loadRooms, loadRoomTypes]);

  useEffect(() => {
    void load();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!statusFilter) return rooms;
    return rooms.filter((r) => r.statusCode === statusFilter);
  }, [rooms, statusFilter]);

  const statusCount = useMemo(() => {
    const counts: Record<string, number> = {};
    rooms.forEach((r) => {
      counts[r.statusCode] = (counts[r.statusCode] ?? 0) + 1;
    });
    return counts;
  }, [rooms]);

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    try {
      await deactivateRoom(establishmentId, deactivateTarget.id);
      showToast("Quarto desativado.", "success");
      setDeactivateTarget(null);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao desativar quarto.", "error");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho */}
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <BedDouble size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Quartos</h1>
              <p className="text-sm text-gray-500">
                {rooms.length} {rooms.length === 1 ? "quarto" : "quartos"} ·{" "}
                {roomTypes.length} tipo(s) de quarto
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRoomTypeFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Building2 size={16} />
              Novo tipo
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingRoom(null);
                setRoomFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Plus size={16} />
              Novo quarto
            </button>
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
        </div>

        {/* Contadores por estado */}
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
                  {statusCount[code] ?? 0}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filtro */}
      <section className="flex flex-wrap items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        {STATUS_FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setStatusFilter(f.value)}
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
      </section>

      {/* Erro */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Lista */}
      {loading && rooms.length === 0 ? (
        <SkeletonGrid />
      ) : filteredRooms.length === 0 ? (
        <EmptyState onCreate={() => setRoomFormOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => {
            const meta = ROOM_STATUS[room.statusCode];
            return (
              <article
                key={room.id}
                className="flex flex-col rounded-2xl border border-borderLight bg-white p-5 shadow-sm transition hover:shadow-md"
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
                      {room.floor ? ` · Piso ${room.floor}` : ""}
                    </p>
                  </div>
                  <StatusBadge label={meta.label} tone={meta.tone} />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Preço / noite</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {currency.format(room.roomType.basePricePerNight  ?? 0)}
                    </p>
                  </div>
                  {room.location && (
                    <p className="text-xs text-gray-500">{room.location}</p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRoom(room);
                      setRoomFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeactivateTarget(room)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                    Desativar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modais */}
      <HotelRoomFormModal
        open={roomFormOpen}
        establishmentId={establishmentId}
        roomTypes={roomTypes}
        editingRoom={editingRoom}
        onClose={() => {
          setRoomFormOpen(false);
          setEditingRoom(null);
        }}
        onSaved={load}
      />

      <HotelRoomTypeFormModal
        open={roomTypeFormOpen}
        establishmentId={establishmentId}
        onClose={() => setRoomTypeFormOpen(false)}
        onCreated={load}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        title="Desativar quarto"
        description={`Tem a certeza que quer desativar o quarto ${deactivateTarget?.number ?? ""}? O histórico será preservado, mas o quarto deixa de aparecer em novas reservas.`}
        confirmLabel="Desativar"
        cancelLabel="Voltar"
        tone="danger"
        loading={deactivating}
        onConfirm={handleDeactivate}
        onClose={() => setDeactivateTarget(null)}
      />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl bg-gray-100"
        />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <BedDouble size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Sem quartos registados
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Crie o primeiro tipo de quarto e adicione os números.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Criar quarto
      </button>
    </div>
  );
}