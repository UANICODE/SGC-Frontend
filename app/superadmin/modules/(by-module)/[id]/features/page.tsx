"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Layers, Plus, RefreshCw } from "lucide-react";

import { useToast } from "@/ context/ToastContext";
import { useFindModule } from "@/shared/hooks/superadmin/module/useFindModule";
import { useCreateFeature } from "@/shared/hooks/superadmin/features/useCreateFeature";
import { useListFeaturesByModule } from "@/shared/hooks/superadmin/features/useListFeaturesByModule";
import { HotelSuperAdminHeader } from "@/shared/components/superadmin/HotelSuperAdminHeader";
import { EmptyState } from "@/shared/components/superadmin/EmptyState";
import { StatusBadge } from "@/shared/components/superadmin/StatusBadge";

export default function ModuleFeaturesPage() {
  const params = useParams<{ id: string }>();
  const moduleId = params.id;

  const { showToast } = useToast();

  const { data: module, fetch: loadModule } = useFindModule();
  const { data: features, loading, fetch: loadFeatures } =
    useListFeaturesByModule();
  const { create: createFeature, loading: creating } = useCreateFeature();

  const [formOpen, setFormOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CORE");

  const load = useCallback(async () => {
    try {
      await Promise.all([loadModule(moduleId), loadFeatures(moduleId)]);
    } catch {
      showToast("Não foi possível carregar os dados.", "error");
    }
  }, [moduleId, loadModule, loadFeatures, showToast]);

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setCode("");
    setName("");
    setDescription("");
    setCategory("CORE");
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!code.trim() || !name.trim() || !category.trim()) {
      showToast("Preencha código, nome e categoria.", "error");
      return;
    }

    try {
      await createFeature({
        moduleId,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        category: category.trim().toUpperCase(),
      });
      showToast("Funcionalidade criada com sucesso.", "success");
      setFormOpen(false);
      await loadFeatures(moduleId);
    } catch (err: any) {
      showToast(err?.message || "Falha ao criar funcionalidade.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/superadmin/hotel/modules"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Voltar para módulos
        </Link>

        <HotelSuperAdminHeader
          eyebrow="Funcionalidades do módulo"
          title={module ? `${module.code} · ${module.name}` : "A carregar módulo..."}
          description="Funcionalidades ativáveis em planos deste módulo. Podem ser exigidas por código no frontend/backend."
          icon={<Layers size={22} />}
          statLabel="Total de funcionalidades"
          statValue={features.length}
          actions={
            <>
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Plus size={18} />
                Nova funcionalidade
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

        {loading && features.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="mt-4 text-sm text-slate-500">A carregar funcionalidades...</p>
          </div>
        ) : features.length === 0 ? (
          <EmptyState
            icon={<Layers size={22} />}
            title="Sem funcionalidades"
            description="Ainda não existem funcionalidades associadas a este módulo."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Criar funcionalidade
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
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((feature) => (
                  <tr key={feature.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                      {feature.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {feature.name}
                      {feature.description && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {feature.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge label={feature.category} tone="info" />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={feature.active ? "Ativa" : "Inativa"}
                        tone={feature.active ? "success" : "neutral"}
                      />
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
            <h3 className="text-lg font-semibold text-slate-900">
              Nova funcionalidade
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Código
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="HOUSEKEEPING"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
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
                  placeholder="Housekeeping"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Categoria
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value.toUpperCase())}
                  placeholder="CORE"
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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={creating}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creating}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
              >
                {creating ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}