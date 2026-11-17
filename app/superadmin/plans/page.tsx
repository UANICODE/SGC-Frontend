"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreditCard,
  Pencil,
  Plus,
  RefreshCw,
  Settings2,
} from "lucide-react";



import { useToast } from "@/ context/ToastContext";
import { useListPlans } from "@/shared/hooks/superadmin/plans/useListPlans";
import { useListModules } from "@/shared/hooks/superadmin/module/useListModules";
import { useCreatePlan } from "@/shared/hooks/superadmin/plans/useCreatePlan";
import { useUpdatePlan } from "@/shared/hooks/superadmin/plans/useUpdatePlan";
import { Plan } from "@/shared/types/superadmin";
import { HotelSuperAdminHeader } from "@/shared/components/superadmin/HotelSuperAdminHeader";
import { EmptyState } from "@/shared/components/superadmin/EmptyState";
import { StatusBadge } from "@/shared/components/superadmin/StatusBadge";
import { useAttachModuleToPlan } from "@/shared/hooks/superadmin/plans/useAttachModuleToPlan";
import { useDetachModuleFromPlan } from "@/shared/hooks/superadmin/plans/useDetachModuleFromPlan";


const currencyFormatter = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

export default function HotelPlansPage() {
  const { showToast } = useToast();

  const { data: plans, loading, fetch: loadPlans } = useListPlans();
  const { data: modules, fetch: loadModules } = useListModules();

  const { create: createPlan, loading: creating } = useCreatePlan();
  const { update: updatePlan, loading: updating } = useUpdatePlan();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("0");
  const [durationDays, setDurationDays] = useState("30");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [moduleId, setModuleId] = useState("");
  const [active, setActive] = useState(true);

  const [modulesModalPlan, setModulesModalPlan] = useState<Plan | null>(null);

  const load = useCallback(async () => {
    try {
      await Promise.all([loadPlans(), loadModules()]);
    } catch {
      showToast("Não foi possível carregar os planos.", "error");
    }
  }, [loadPlans, loadModules, showToast]);

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditing(null);
    setCode("");
    setName("");
    setDescription("");
    setMonthlyPrice("0");
    setDurationDays("30");
    setDisplayOrder("1");
    setModuleId(modules[0]?.id ?? "");
    setActive(true);
  }

  function openCreate() {
    resetForm();
    setFormOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditing(plan);
    setCode(plan.code);
    setName(plan.name);
    setDescription(plan.description ?? "");
    setMonthlyPrice(String(plan.monthlyPrice));
    setDurationDays(String(plan.durationDays));
    setDisplayOrder(String(plan.displayOrder));
    setModuleId(plan.moduleId ?? "");
    setActive(plan.active);
    setFormOpen(true);
  }

  async function handleSubmit() {
    const price = Number(monthlyPrice);
    const days = Number(durationDays);
    const order = Number(displayOrder);

    if (!name.trim() || (!editing && !code.trim())) {
      showToast("Preencha código e nome do plano.", "error");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      showToast("Preço mensal inválido.", "error");
      return;
    }
    if (!Number.isFinite(days) || days < 1) {
      showToast("Duração inválida.", "error");
      return;
    }

    try {
      if (editing) {
        await updatePlan(editing.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          monthlyPrice: price,
          durationDays: days,
          displayOrder: order,
          active,
        });
        showToast("Plano atualizado com sucesso.", "success");
      } else {
        if (!moduleId) {
          showToast("Selecione um módulo principal.", "error");
          return;
        }
        await createPlan({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
          monthlyPrice: price,
          durationDays: days,
          displayOrder: order,
          moduleId,
        });
        showToast("Plano criado com sucesso.", "success");
      }
      setFormOpen(false);
      resetForm();
      await loadPlans();
    } catch (err: any) {
      showToast(err?.message || "Falha ao guardar plano.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <HotelSuperAdminHeader
          eyebrow="Comercial do módulo HOTEL"
          title="Planos do módulo hoteleiro"
          description="Cada plano define o que um estabelecimento contrata. Associe módulos e funcionalidades e controle a duração e o preço."
          icon={<CreditCard size={22} />}
          statLabel="Total de planos"
          statValue={plans.length}
          actions={
            <>
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Plus size={18} />
                Novo plano
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

        {loading && plans.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="mt-4 text-sm text-slate-500">A carregar planos...</p>
          </div>
        ) : plans.length === 0 ? (
          <EmptyState
            icon={<CreditCard size={22} />}
            title="Sem planos"
            description="Ainda não existem planos configurados para o módulo HOTEL."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Criar plano
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold text-cyan-600">
                      {plan.code}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                      {plan.name}
                    </h3>
                  </div>
                  <StatusBadge
                    label={plan.active ? "Ativo" : "Inativo"}
                    tone={plan.active ? "success" : "neutral"}
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {plan.description ?? "Sem descrição."}
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {currencyFormatter.format(plan.monthlyPrice)}
                  </span>
                  <span className="text-xs text-slate-500">/ {plan.durationDays} dias</span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(plan)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setModulesModalPlan(plan)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Settings2 size={14} />
                    Módulos
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal criar/editar plano */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">
              {editing ? "Editar plano" : "Novo plano"}
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Código
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={!!editing}
                  placeholder="BASIC"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Plano Básico"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Preço mensal (MZN)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Duração (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ordem de exibição
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {!editing && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Módulo principal
                  </label>
                  <select
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Selecione...</option>
                    {modules.map((mod) => (
                      <option key={mod.id} value={mod.id}>
                        {mod.code} · {mod.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
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
                <label className="sm:col-span-2 flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  Plano ativo
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

      {/* Modal gerir módulos do plano */}
      {modulesModalPlan && (
        <ManagePlanModulesModal
          plan={modulesModalPlan}
          onClose={() => setModulesModalPlan(null)}
          onChanged={async () => {
            await loadPlans();
          }}
        />
      )}
    </div>
  );
}

function ManagePlanModulesModal({
  plan,
  onClose,
  onChanged,
}: {
  plan: Plan;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const { showToast } = useToast();
  const { data: modules, fetch: loadModules } = useListModules();
  const { attach, loading: attaching } = useAttachModuleToPlan();
  const { detach, loading: detaching } = useDetachModuleFromPlan();

  useEffect(() => {
    void loadModules();
  }, []);

  const linkedModuleIds = new Set(plan.moduleIds);

  async function toggle(modId: string) {
    try {
      if (linkedModuleIds.has(modId)) {
        await detach(plan.id, modId);
        showToast("Módulo removido do plano.", "success");
      } else {
        await attach(plan.id, modId);
        showToast("Módulo associado ao plano.", "success");
      }
      await onChanged();
    } catch (err: any) {
      showToast(err?.message || "Falha ao alterar módulo do plano.", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">
          Módulos do plano · {plan.code}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Selecione os módulos que este plano inclui.
        </p>

        <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
          {modules.map((mod) => {
            const linked = linkedModuleIds.has(mod.id);
            return (
              <li
                key={mod.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-slate-700">
                    {mod.code}
                  </p>
                  <p className="text-sm text-slate-800">{mod.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(mod.id)}
                  disabled={attaching || detaching}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    linked
                      ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  } disabled:opacity-50`}
                >
                  {linked ? "Remover" : "Adicionar"}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}