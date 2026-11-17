"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, Plus, Search, X } from "lucide-react";

import { useListRooms } from "@/hooks/hotel/rooms/useListRooms";
import { useSearchGuests } from "@/hooks/hotel/guests/useSearchGuests";
import { useCreateGuest } from "@/hooks/hotel/guests/useCreateGuest";
import { useCreateReservation } from "@/hooks/hotel/reservations/useCreateReservation";
import { useToast } from "@/ context/ToastContext";

import type {
  DocumentType,
  Guest,
  HotelApiRole,
  ReservationRoomInput,
  Room,
} from "@/types/hotel";
import { STAY_PERIOD_UNIT } from "@/types/hotel/catalogs";

interface Props {
  open: boolean;
  establishmentId: string;
  role: HotelApiRole;
  onClose: () => void;
  onCreated: (reservationId: string) => void | Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

function localDateTimeToIso(local: string): string {
  return new Date(local).toISOString();
}

function minDateTimeFrom(checkIn: string): string | undefined {
  if (!checkIn) return undefined;
  const dt = new Date(checkIn);
  if (Number.isNaN(dt.getTime())) return undefined;
  dt.setMinutes(dt.getMinutes() + 1);
  const offset = dt.getTimezoneOffset() * 60_000;
  return new Date(dt.getTime() - offset).toISOString().slice(0, 16);
}

/**
 * Devolve o preço unitário do quarto conforme a unidade de período escolhida.
 * - HOURS → usa basePricePerHour; se não existir, cai para basePricePerNight.
 * - DAYS / WEEKS / MONTHS / YEARS → usa basePricePerNight.
 */
function resolveUnitPrice(room: Room, periodUnitCode: string): number {
  const rt = room.roomType as any; // tolera backend que ainda não devolve o campo
  const pricePerNight = Number(rt.basePricePerNight ?? 0);
  const pricePerHour = Number(rt.basePricePerHour ?? 0);

  if (periodUnitCode === "HOURS" && pricePerHour > 0) {
    return pricePerHour;
  }
  return pricePerNight;
}

function unitLabel(periodUnitCode: string): string {
  switch (periodUnitCode) {
    case "HOURS":
      return "hora";
    case "DAYS":
      return "noite";
    case "WEEKS":
      return "semana";
    case "MONTHS":
      return "mês";
    case "YEARS":
      return "ano";
    default:
      return "período";
  }
}

export function HotelReservationCreateModal({
  open,
  establishmentId,
  role,
  onClose,
  onCreated,
}: Props) {
  const { showToast } = useToast();

  const rooms = useListRooms();
  const createGuest = useCreateGuest();
  const createReservation = useCreateReservation();

  const searchGuestMain = useSearchGuests();
  const searchCompanions = useSearchGuests();

  // Hóspede principal
  const [guestMode, setGuestMode] = useState<"existing" | "new">("existing");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("BI");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Reserva
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [notes, setNotes] = useState("");
  const [roomItems, setRoomItems] = useState<ReservationRoomInput[]>([]);

  // Pesquisa hóspede principal
  const [term, setTerm] = useState("");

  // Acompanhantes
  const [companions, setCompanions] = useState<Guest[]>([]);
  const [companionTerm, setCompanionTerm] = useState("");
  const [companionMode, setCompanionMode] = useState<"existing" | "new">("existing");

  // Novo acompanhante
  const [newCompanionFullName, setNewCompanionFullName] = useState("");
  const [newCompanionDocType, setNewCompanionDocType] = useState<DocumentType>("BI");
  const [newCompanionDocNumber, setNewCompanionDocNumber] = useState("");
  const [newCompanionPhone, setNewCompanionPhone] = useState("");
  const [newCompanionEmail, setNewCompanionEmail] = useState("");

  // Carrega quartos
  useEffect(() => {
    if (!open) return;
    void rooms.fetch(establishmentId, role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, establishmentId, role]);

  // Pesquisa do hóspede principal
  useEffect(() => {
    if (!open || guestMode !== "existing") return;
    const timer = setTimeout(() => {
      void searchGuestMain.fetch(
        establishmentId,
        term.trim() || undefined,
        role,
      );
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, guestMode, open, establishmentId, role]);

  // Pesquisa de acompanhantes
  useEffect(() => {
    if (!open || companionMode !== "existing") return;
    const timer = setTimeout(() => {
      void searchCompanions.fetch(
        establishmentId,
        companionTerm.trim() || undefined,
        role,
      );
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionTerm, companionMode, open, establishmentId, role]);

  // Se o check-in mudar e o check-out ficar inválido, limpa
  useEffect(() => {
    if (!checkIn || !checkOut) return;
    if (new Date(checkOut) <= new Date(checkIn)) {
      setCheckOut("");
    }
  }, [checkIn, checkOut]);

  // Total estimado (usa o preço unitário certo)
  const estimatedTotal = useMemo(() => {
    return roomItems.reduce((acc, item) => {
      const room = rooms.data.find((r) => r.id === item.roomId);
      if (!room) return acc;
      return acc + resolveUnitPrice(room, item.periodUnitCode) * item.periodCount;
    }, 0);
  }, [roomItems, rooms.data]);

  if (!open) return null;

  function resetAll() {
    setGuestMode("existing");
    setSelectedGuest(null);
    setFullName("");
    setDocumentType("BI");
    setDocumentNumber("");
    setPhone("");
    setEmail("");
    setCheckIn("");
    setCheckOut("");
    setAdults("1");
    setChildren("0");
    setNotes("");
    setRoomItems([]);
    setTerm("");
    setCompanions([]);
    setCompanionTerm("");
    setCompanionMode("existing");
    setNewCompanionFullName("");
    setNewCompanionDocType("BI");
    setNewCompanionDocNumber("");
    setNewCompanionPhone("");
    setNewCompanionEmail("");
  }

  function addRoom(room: Room) {
    setRoomItems((prev) => [
      ...prev,
      { roomId: room.id, periodCount: 1, periodUnitCode: "DAYS" },
    ]);
  }

  function updateRoomItem(index: number, patch: Partial<ReservationRoomInput>) {
    setRoomItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function removeRoom(index: number) {
    setRoomItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addCompanion(guest: Guest) {
    setCompanions((prev) => {
      if (prev.some((c) => c.id === guest.id)) return prev;
      return [...prev, guest];
    });
    setCompanionTerm("");
  }

  function removeCompanion(guestId: string) {
    setCompanions((prev) => prev.filter((c) => c.id !== guestId));
  }

  async function handleAddNewCompanion() {
    if (!newCompanionFullName.trim()) {
      showToast("Indique o nome do acompanhante.", "error");
      return;
    }

    try {
      const created = await createGuest.create(
        establishmentId,
        {
          fullName: newCompanionFullName.trim(),
          documentType: newCompanionDocType,
          documentNumber: newCompanionDocNumber.trim() || undefined,
          phone: newCompanionPhone.trim() || undefined,
          email: newCompanionEmail.trim() || undefined,
        },
        role,
      );

      addCompanion(created);
      showToast("Acompanhante criado.", "success");

      setNewCompanionFullName("");
      setNewCompanionDocType("BI");
      setNewCompanionDocNumber("");
      setNewCompanionPhone("");
      setNewCompanionEmail("");
      setCompanionMode("existing");
    } catch (err: any) {
      showToast(err?.message || "Falha ao criar acompanhante.", "error");
    }
  }

  async function handleSubmit() {
    const adultsN = Number(adults);
    const childrenN = Number(children);

    if (guestMode === "existing" && !selectedGuest) {
      showToast("Selecione um hóspede.", "error");
      return;
    }
    if (guestMode === "new" && !fullName.trim()) {
      showToast("Indique o nome do hóspede.", "error");
      return;
    }
    if (!checkIn || !checkOut) {
      showToast("Indique as datas de check-in e check-out.", "error");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      showToast(
        "O check-out tem de ser posterior ao check-in (data e hora).",
        "error",
      );
      return;
    }
    if (!Number.isFinite(adultsN) || adultsN < 1) {
      showToast("Número de adultos inválido.", "error");
      return;
    }
    if (roomItems.length === 0) {
      showToast("Adicione pelo menos um quarto.", "error");
      return;
    }

    try {
      let guestId = selectedGuest?.id;

      if (guestMode === "new") {
        const created = await createGuest.create(
          establishmentId,
          {
            fullName: fullName.trim(),
            documentType,
            documentNumber: documentNumber.trim() || undefined,
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
          },
          role,
        );
        guestId = created.id;
      }

      if (!guestId) {
        showToast("Hóspede em falta.", "error");
        return;
      }

      const reservation = await createReservation.create(
        establishmentId,
        {
          guestId,
          checkInPlanned: localDateTimeToIso(checkIn),
          checkOutPlanned: localDateTimeToIso(checkOut),
          adults: adultsN,
          children: Number.isFinite(childrenN) ? childrenN : 0,
          notes: notes.trim() || undefined,
          rooms: roomItems,
          companionGuestIds: companions.map((c) => c.id),
        },
        role,
      );

      showToast("Reserva criada.", "success");
      resetAll();
      await onCreated(reservation.id);
    } catch (err: any) {
      showToast(err?.message || "Falha ao criar reserva.", "error");
    }
  }

  const minCheckOut = minDateTimeFrom(checkIn);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Nova reserva</h3>
          <button
            type="button"
            onClick={() => {
              resetAll();
              onClose();
            }}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hóspede principal */}
        <section className="mt-5">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900">Hóspede</h4>
            <div className="ml-auto flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setGuestMode("existing")}
                className={`rounded-full px-3 py-1 font-semibold ring-1 transition ${
                  guestMode === "existing"
                    ? "bg-primary text-white ring-primary"
                    : "bg-white text-gray-600 ring-gray-200"
                }`}
              >
                Existente
              </button>
              <button
                type="button"
                onClick={() => setGuestMode("new")}
                className={`rounded-full px-3 py-1 font-semibold ring-1 transition ${
                  guestMode === "new"
                    ? "bg-primary text-white ring-primary"
                    : "bg-white text-gray-600 ring-gray-200"
                }`}
              >
                Novo
              </button>
            </div>
          </div>

          {guestMode === "existing" ? (
            <div className="mt-3">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Pesquisar por nome…"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {selectedGuest && (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                  <span>{selectedGuest.fullName}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedGuest(null)}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Limpar
                  </button>
                </div>
              )}

              {!selectedGuest && searchGuestMain.data.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                  {searchGuestMain.data.map((g) => (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedGuest(g)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-800">
                          {g.fullName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {g.documentNumber ?? g.phone ?? g.email ?? ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Documento
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className={inputClass}
                >
                  <option value="BI">BI</option>
                  <option value="PASSPORT">Passaporte</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Número
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Telefone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </section>

        {/* Período */}
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Check-in previsto
            </label>
            <input
              type="datetime-local"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Check-out previsto
            </label>
            <input
              type="datetime-local"
              value={checkOut}
              min={minCheckOut}
              onChange={(e) => setCheckOut(e.target.value)}
              disabled={!checkIn}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-50`}
            />
            {!checkIn && (
              <p className="mt-1 text-[11px] text-gray-400">
                Escolha primeiro o check-in.
              </p>
            )}
            {checkIn && minCheckOut && (
              <p className="mt-1 text-[11px] text-gray-400">
                Deve ser depois de{" "}
                {new Date(checkIn).toLocaleString("pt-PT", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                .
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Adultos
            </label>
            <input
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Crianças
            </label>
            <input
              type="number"
              min="0"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
        </section>

        {/* Quartos */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Quartos</h4>
            <p className="text-xs text-gray-500">{roomItems.length} selecionado(s)</p>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rooms.data
              .filter((r) => !roomItems.some((item) => item.roomId === r.id))
              .map((room) => {
                const rt = room.roomType as any;
                const pricePerNight = Number(rt.basePricePerNight ?? 0);
                const pricePerHour = Number(rt.basePricePerHour ?? 0);

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => addRoom(room)}
                    className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2 text-left text-sm hover:border-primary hover:bg-primary/5"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        Nº {room.number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {room.roomType.name} · {room.roomType.capacity} pax
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {currency.format(pricePerNight)} / noite
                        {pricePerHour > 0 && (
                          <>
                            {" · "}
                            {currency.format(pricePerHour)} / hora
                          </>
                        )}
                      </p>
                    </div>
                    <Plus size={16} className="text-primary" />
                  </button>
                );
              })}
          </div>

          {roomItems.length > 0 && (
            <ul className="mt-3 space-y-2">
              {roomItems.map((item, index) => {
                const room = rooms.data.find((r) => r.id === item.roomId);
                if (!room) return null;

                const rt = room.roomType as any;
                const pricePerNight = Number(rt.basePricePerNight ?? 0);
                const pricePerHour = Number(rt.basePricePerHour ?? 0);
                const allowsHourly = pricePerHour > 0;

                const unitPrice = resolveUnitPrice(room, item.periodUnitCode);
                const subtotal = unitPrice * item.periodCount;
                const priceLabel = unitLabel(item.periodUnitCode);

                return (
                  <li
                    key={`${item.roomId}-${index}`}
                    className="rounded-xl border border-gray-200 p-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Nº {room.number} · {room.roomType.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {currency.format(unitPrice)} / {priceLabel}
                          {allowsHourly && item.periodUnitCode !== "HOURS" && (
                            <>
                              {" · "}
                              {currency.format(pricePerHour)} / hora
                            </>
                          )}
                          {!allowsHourly && (
                            <>
                              {" · "}
                              sem tarifa por hora
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={item.periodCount}
                          onChange={(e) =>
                            updateRoomItem(index, {
                              periodCount: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                          className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
                        />
                        <select
                          value={item.periodUnitCode}
                          onChange={(e) =>
                            updateRoomItem(index, {
                              periodUnitCode: e.target.value,
                            })
                          }
                          className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
                        >
                          <option value="DAYS">
                            {STAY_PERIOD_UNIT.DAYS.label}
                          </option>
                          {allowsHourly && (
                            <option value="HOURS">
                              {STAY_PERIOD_UNIT.HOURS.label}
                            </option>
                          )}
                          <option value="WEEKS">
                            {STAY_PERIOD_UNIT.WEEKS.label}
                          </option>
                          <option value="MONTHS">
                            {STAY_PERIOD_UNIT.MONTHS.label}
                          </option>
                          <option value="YEARS">
                            {STAY_PERIOD_UNIT.YEARS.label}
                          </option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeRoom(index)}
                          className="rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50"
                          aria-label="Remover"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal do quarto */}
                    <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">
                        Subtotal
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {currency.format(subtotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Total estimado */}
        {roomItems.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Banknote size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
                    Total estimado
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {roomItems.length} quarto(s) ·{" "}
                    {roomItems.reduce((acc, i) => acc + i.periodCount, 0)}{" "}
                    período(s)
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-primary sm:text-3xl">
                {currency.format(estimatedTotal)}
              </p>
            </div>
          
          </section>
        )}

        {/* Acompanhantes */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">
              Acompanhantes (opcional)
            </h4>
            <p className="text-xs text-gray-500">
              {companions.length} selecionado(s)
            </p>
          </div>

          {companions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {companions.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800"
                >
                  <span>{c.fullName}</span>
                  <button
                    type="button"
                    onClick={() => removeCompanion(c.id)}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCompanionMode("existing")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                companionMode === "existing"
                  ? "bg-primary text-white ring-primary"
                  : "bg-white text-gray-600 ring-gray-200"
              }`}
            >
              Existente
            </button>
            <button
              type="button"
              onClick={() => setCompanionMode("new")}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                companionMode === "new"
                  ? "bg-primary text-white ring-primary"
                  : "bg-white text-gray-600 ring-gray-200"
              }`}
            >
              Novo
            </button>
          </div>

          {companionMode === "existing" && (
            <>
              <div className="relative mt-2">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={companionTerm}
                  onChange={(e) => setCompanionTerm(e.target.value)}
                  placeholder="Pesquisar hóspede para adicionar como acompanhante…"
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {searchCompanions.data.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                  {searchCompanions.data
                    .filter(
                      (g) =>
                        g.id !== selectedGuest?.id &&
                        !companions.some((c) => c.id === g.id),
                    )
                    .map((g) => (
                      <li key={g.id}>
                        <button
                          type="button"
                          onClick={() => addCompanion(g)}
                          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-800">
                            {g.fullName}
                          </span>
                          <Plus size={14} className="text-primary" />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </>
          )}

          {companionMode === "new" && (
            <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={newCompanionFullName}
                  onChange={(e) => setNewCompanionFullName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Documento
                </label>
                <select
                  value={newCompanionDocType}
                  onChange={(e) =>
                    setNewCompanionDocType(e.target.value as DocumentType)
                  }
                  className={inputClass}
                >
                  <option value="BI">BI</option>
                  <option value="PASSPORT">Passaporte</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Número
                </label>
                <input
                  type="text"
                  value={newCompanionDocNumber}
                  onChange={(e) => setNewCompanionDocNumber(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Telefone
                </label>
                <input
                  type="text"
                  value={newCompanionPhone}
                  onChange={(e) => setNewCompanionPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  value={newCompanionEmail}
                  onChange={(e) => setNewCompanionEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex justify-end sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddNewCompanion}
                  disabled={createGuest.loading}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {createGuest.loading ? "A criar..." : "Adicionar acompanhante"}
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              resetAll();
              onClose();
            }}
            disabled={createReservation.loading || createGuest.loading}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createReservation.loading || createGuest.loading}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {createReservation.loading ? "A criar..." : "Criar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}