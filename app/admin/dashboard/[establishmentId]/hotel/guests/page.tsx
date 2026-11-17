"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Search, UserPlus, Pencil, RefreshCw } from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useSearchGuests } from "@/hooks/hotel/guests/useSearchGuests";
import { useCreateGuest } from "@/hooks/hotel/guests/useCreateGuest";
import { useUpdateGuest } from "@/hooks/hotel/guests/useUpdateGuest";
import { useToast } from "@/ context/ToastContext";
import type { Guest, DocumentType, CreateGuestInput } from "@/types/hotel";

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function HotelGuestsPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();

  const { data: guests, loading, fetch: loadGuests } = useSearchGuests();
  const { create, loading: creating } = useCreateGuest();
  const { update, loading: updating } = useUpdateGuest();

  const [term, setTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);

  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("BI");
  const [documentNumber, setDocumentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    await loadGuests(establishmentId, term.trim() || undefined);
  }, [loadGuests, establishmentId, term]);

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditing(null);
    setFullName("");
    setDocumentType("BI");
    setDocumentNumber("");
    setPhone("");
    setEmail("");
    setNotes("");
  }

  function openCreate() {
    resetForm();
    setFormOpen(true);
  }

  function openEdit(guest: Guest) {
    setEditing(guest);
    setFullName(guest.fullName);
    setDocumentType((guest.documentType as DocumentType) || "BI");
    setDocumentNumber(guest.documentNumber || "");
    setPhone(guest.phone || "");
    setEmail(guest.email || "");
    setNotes(guest.notes || "");
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!fullName.trim()) {
      showToast("Indique o nome completo.", "error");
      return;
    }

    const payload: CreateGuestInput = {
      fullName: fullName.trim(),
      documentType,
      documentNumber: documentNumber.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      if (editing) {
        await update(establishmentId, editing.id, payload);
        showToast("Hóspede atualizado.", "success");
      } else {
        await create(establishmentId, payload);
        showToast("Hóspede criado.", "success");
      }
      setFormOpen(false);
      resetForm();
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao guardar hóspede.", "error");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary">Hóspedes</h1>
            <p className="text-sm text-gray-500">Gestão da base de dados de clientes.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <UserPlus size={16} />
              Novo Hóspede
            </button>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="mt-5 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Pesquisar por nome..."
            className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>

      {loading && guests.length === 0 ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
      ) : guests.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">Nenhum hóspede encontrado.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-borderLight bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {guests.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {g.fullName}
                    {g.notes && <p className="text-xs text-gray-500 font-normal">{g.notes}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {g.documentType} {g.documentNumber ? `· ${g.documentNumber}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {g.phone || "-"}<br/><span className="text-xs text-gray-400">{g.email || ""}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(g)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {editing ? "Editar hóspede" : "Novo hóspede"}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Nome Completo</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Doc.</label>
                <select value={documentType} onChange={e => setDocumentType(e.target.value as DocumentType)} className={inputClass}>
                  <option value="BI">BI</option>
                  <option value="PASSPORT">Passaporte</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Número</label>
                <input type="text" value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Telefone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Notas (opcional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={inputClass} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setFormOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSubmit} disabled={creating || updating} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
                {creating || updating ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}