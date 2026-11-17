"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Layers, Pencil, Plus, RefreshCw, Sparkles } from "lucide-react";



import { useToast } from "@/ context/ToastContext";
import { useListModules } from "@/shared/hooks/superadmin/module/useListModules";
import { useCreateModule } from "@/shared/hooks/superadmin/module/useCreateModule";
import { useUpdateModule } from "@/shared/hooks/superadmin/module/useUpdateModule";
import { Module } from "@/shared/types/superadmin/module";
import { HotelSuperAdminHeader } from "@/shared/components/superadmin/HotelSuperAdminHeader";
import { EmptyState } from "@/shared/components/superadmin/EmptyState";
import { StatusBadge } from "@/shared/components/superadmin/StatusBadge";


export default function HotelModulesPage() {
  const { showToast } = useToast();

  const { data: modules, loading, fetch: loadModules } = useListModules();
  const { create: createModule, loading: creating } = useCreateModule();
  const { update: updateModule, loading: updating } = useUpdateModule();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);

  const resetForm = useCallback(() => {
    setEditing(null);
    setCode("");
    setName("");
    setDescription("");
    setActive(true);
  }, []);

  const load = useCallback(async () => {
    try {
      await loadModules();
    } catch {
      showToast("Não foi possível carregar os módulos.", "error");
    }
  }, [loadModules, showToast]);

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    resetForm();
    setFormOpen(true);
  }

  function openEdit(mod: Module) {
    setEditing(mod);
    setCode(mod.code);
    setName(mod.name);
    setDescription(mod.description ?? "");
    setActive(mod.active);
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!name.trim() || (!editing && !code.trim())) {
      showToast("Preencha o código e o nome do módulo.", "error");
      return;
    }

    try {
      if (editing) {
        await updateModule(editing.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          active,
        });
        showToast("Módulo atualizado com sucesso.", "success");
      } else {
        await createModule({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
        });
        showToast("Módulo criado com sucesso.", "success");
      }
      setFormOpen(false);
      resetForm();
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao guardar o módulo.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <HotelSuperAdminHeader
          eyebrow="Administração global"
          title="Módulos do sistema"
          description="Gerir os módulos disponíveis para os estabelecimentos (HOTEL, RH, POS, ...). Cada módulo agrupa funcionalidades e planos."
          icon={<Boxes size={22} />}
          statLabel="Total de módulos"
          statValue={modules.length}
          actions={
            <>
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Plus size={18} />
                Novo módulo
              </button>
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                Atualizar
              </button>
            </>
          }
        />

        {loading && modules.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="mt-4 text-sm text-slate-500">A carregar módulos...</p>
          </div>
        ) : modules.length === 0 ? (
          <EmptyState
            icon={<Boxes size={22} />}
            title="Nenhum módulo registado"
            description="Ainda não existem módulos no sistema. Crie o primeiro para começar."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Criar módulo
              </button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Código</th>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Descrição</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map((mod) => (
                  <tr key={mod.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                      {mod.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {mod.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {mod.description ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={mod.active ? "Ativo" : "Inativo"}
                        tone={mod.active ? "success" : "neutral"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/superadmin/modules/${mod.id}/features`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          <Layers size={14} />
                          Features
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(mod)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-600">
              <Sparkles size={18} />
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Editar módulo" : "Novo módulo"}
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Código
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={!!editing}
                  placeholder="HOTEL"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Gestão Hoteleira"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {editing && (
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  Módulo ativo
                </label>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                disabled={creating || updating}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creating || updating}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                {creating || updating ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}