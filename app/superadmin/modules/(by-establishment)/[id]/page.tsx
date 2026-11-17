"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Boxes, RefreshCw, ShieldCheck } from "lucide-react";



import { useToast } from "@/ context/ToastContext";
import { ModuleSource } from "@/shared/types/superadmin/common";
import { useListEstablishmentModules } from "@/shared/hooks/superadmin/subscriptions/useListEstablishmentModules";
import { useAssignModuleToEstablishment } from "@/shared/hooks/superadmin/module/useAssignModuleToEstablishment";
import { HotelSuperAdminHeader } from "@/shared/components/superadmin/HotelSuperAdminHeader";
import { EmptyState } from "@/shared/components/superadmin/EmptyState";
import { StatusBadge } from "@/shared/components/superadmin/StatusBadge";



const SOURCE_LABEL: Record<ModuleSource, string> = {
  PLAN: "Plano",
  OVERRIDE: "Override",
  BUSINESS_TYPE: "Tipo de negócio",
};

const SOURCE_TONE: Record<ModuleSource, "info" | "warning" | "neutral"> = {
  PLAN: "info",
  OVERRIDE: "warning",
  BUSINESS_TYPE: "neutral",
};

export default function EstablishmentModulesPage() {
  const params = useParams<{ id: string }>();
  const establishmentId = params.id;

  const { showToast } = useToast();

  const { data: modules, loading, fetch: loadModules } =
    useListEstablishmentModules();
  const { assign, loading: assigning } = useAssignModuleToEstablishment();

  const load = useCallback(async () => {
    try {
      await loadModules(establishmentId);
    } catch {
      showToast("Não foi possível carregar os módulos do estabelecimento.", "error");
    }
  }, [establishmentId, loadModules, showToast]);

  useEffect(() => {
    void load();
  }, []);

  async function toggle(moduleCode: string, enabled: boolean) {
    try {
      await assign(establishmentId, { moduleCode, enabled });
      showToast(
        enabled
          ? `Módulo ${moduleCode} ativado neste estabelecimento.`
          : `Módulo ${moduleCode} desativado neste estabelecimento.`,
        "success",
      );
      await loadModules(establishmentId);
    } catch (err: any) {
      showToast(err?.message || "Falha ao atualizar módulo.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/superadmin/establishments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Voltar para estabelecimentos
        </Link>

        <HotelSuperAdminHeader
          eyebrow="Módulos do estabelecimento"
          title="Gestão de módulos"
          description="Ativar ou desativar módulos. Um override explícito tem prioridade sobre o plano e o tipo de negócio."
          icon={<ShieldCheck size={22} />}
          statLabel="Módulos listados"
          statValue={modules.length}
          actions={
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Atualizar
            </button>
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
            title="Nenhum módulo listado"
            description="Este estabelecimento ainda não tem módulos ativos. Aplique um override ou uma subscrição para começar."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Módulo</th>
                  <th className="px-6 py-3">Origem</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map((mod) => (
                  <tr key={mod.moduleId} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-semibold text-slate-700">
                        {mod.moduleCode}
                      </p>
                      <p className="text-sm text-slate-800">{mod.moduleName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={SOURCE_LABEL[mod.source]}
                        tone={SOURCE_TONE[mod.source]}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={mod.enabled ? "Ativo" : "Inativo"}
                        tone={mod.enabled ? "success" : "neutral"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => toggle(mod.moduleCode, !mod.enabled)}
                          disabled={assigning}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                            mod.enabled
                              ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          } disabled:opacity-50`}
                        >
                          {mod.enabled ? "Desativar" : "Ativar"}
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
    </div>
  );
}