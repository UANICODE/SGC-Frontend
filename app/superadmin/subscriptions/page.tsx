"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";



import { useToast } from "@/ context/ToastContext";
import { Subscription, SubscriptionStatus } from "@/shared/types/superadmin";
import { useListPlans } from "@/shared/hooks/superadmin/plans/useListPlans";
import { useListSubscriptions } from "@/shared/hooks/superadmin/subscriptions/useListSubscriptions";
import { useCreateSubscription } from "@/shared/hooks/superadmin/subscriptions/useCreateSubscription";
import { useListEstablishments } from "@/hooks/restaurant/superadmin/establishments/useListEstablishments";
import { useUpdateSubscription } from "@/shared/hooks/superadmin/subscriptions/useUpdateSubscription";
import { useCancelSubscription } from "@/shared/hooks/superadmin/subscriptions/useCancelSubscription";
import { HotelSuperAdminHeader } from "@/shared/components/superadmin/HotelSuperAdminHeader";
import { EmptyState } from "@/shared/components/superadmin/EmptyState";
import { StatusBadge } from "@/shared/components/superadmin/StatusBadge";
import { ConfirmDialog } from "@/shared/components/superadmin/ConfirmDialog";


type BadgeTone = "success" | "warning" | "danger" | "neutral" | "info";

const STATUS_TONE: Record<SubscriptionStatus, BadgeTone> = {
  ACTIVE: "success",
  EXPIRED: "neutral",
  CANCELLED: "danger",
  SUSPENDED: "warning",
};

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  ACTIVE: "Ativa",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
  SUSPENDED: "Suspensa",
};

const FILTERS: Array<{ value: "" | SubscriptionStatus; label: string }> = [
  { value: "", label: "Todas" },
  { value: "ACTIVE", label: "Ativas" },
  { value: "EXPIRED", label: "Expiradas" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "SUSPENDED", label: "Suspensas" },
];

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toIsoWithSeconds(localValue: string): string {
  if (!localValue) return "";
  const date = new Date(localValue);
  return date.toISOString();
}

export default function HotelSubscriptionsPage() {
  const { showToast } = useToast();

  const { data: subscriptions, loading, fetch: loadSubscriptions } =
    useListSubscriptions();
  const { data: plans, fetch: loadPlans } = useListPlans();
  const {
    data: establishments,
    execute: loadEstablishments,
  } = useListEstablishments();

  const { create: createSubscription, loading: creating } =
    useCreateSubscription();
  const { update: updateSubscription, loading: updating } =
    useUpdateSubscription();
  const { cancel: cancelSubscription, loading: cancelling } =
    useCancelSubscription();

  const [statusFilter, setStatusFilter] = useState<"" | SubscriptionStatus>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);

  const [establishmentId, setEstablishmentId] = useState("");
  const [planId, setPlanId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [autoRenew, setAutoRenew] = useState(true);
  const [notes, setNotes] = useState("");

  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);

  const establishmentOptions = useMemo(
    () => establishments?.content ?? [],
    [establishments],
  );

  const load = useCallback(async () => {
    try {
      await Promise.all([
        loadSubscriptions(statusFilter || undefined),
        loadPlans({ active: true }),
        loadEstablishments({ page: 0, size: 100 }),
      ]);
    } catch {
      showToast("Não foi possível carregar os dados.", "error");
    }
  }, [
    statusFilter,
    loadSubscriptions,
    loadPlans,
    loadEstablishments,
    showToast,
  ]);

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditing(null);
    setEstablishmentId("");
    setPlanId("");
    setStartDate("");
    setEndDate("");
    setAutoRenew(true);
    setNotes("");
  }

  function openCreate() {
    resetForm();
    setFormOpen(true);
  }

  function openEdit(subscription: Subscription) {
    setEditing(subscription);
    setEstablishmentId(subscription.establishmentId);
    setPlanId(subscription.planId);
    setStartDate(toLocalInputValue(subscription.startDate));
    setEndDate(toLocalInputValue(subscription.endDate));
    setAutoRenew(subscription.autoRenew);
    setNotes(subscription.notes ?? "");
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!editing && !establishmentId) {
      showToast("Selecione um estabelecimento.", "error");
      return;
    }
    if (!planId) {
      showToast("Selecione um plano.", "error");
      return;
    }
    if (!startDate || !endDate) {
      showToast("Indique data de início e fim.", "error");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      showToast("A data de fim deve ser posterior à data de início.", "error");
      return;
    }

    const startIso = toIsoWithSeconds(startDate);
    const endIso = toIsoWithSeconds(endDate);

    try {
      if (editing) {
        await updateSubscription(editing.id, {
          planId,
          startDate: startIso,
          endDate: endIso,
          autoRenew,
          notes: notes.trim() || undefined,
        });
        showToast("Subscrição atualizada com sucesso.", "success");
      } else {
        await createSubscription({
          establishmentId,
          planId,
          startDate: startIso,
          endDate: endIso,
          autoRenew,
          notes: notes.trim() || undefined,
        });
        showToast("Subscrição criada com sucesso.", "success");
      }
      setFormOpen(false);
      resetForm();
      await loadSubscriptions(statusFilter || undefined);
    } catch (err: any) {
      showToast(err?.message || "Falha ao guardar a subscrição.", "error");
    }
  }

  async function handleCancel() {
    if (!cancelTarget) return;
    try {
      await cancelSubscription(cancelTarget.id);
      showToast("Subscrição cancelada.", "success");
      setCancelTarget(null);
      await loadSubscriptions(statusFilter || undefined);
    } catch (err: any) {
      showToast(err?.message || "Falha ao cancelar a subscrição.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <HotelSuperAdminHeader
          eyebrow="Comercial do módulo HOTEL"
          title="Subscrições"
          description="Contratos de plano ativos ou históricos por estabelecimento. Uma subscrição ativa garante acesso ao módulo HOTEL."
          icon={<CalendarClock size={22} />}
          statLabel="Total listado"
          statValue={subscriptions.length}
          actions={
            <>
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <Plus size={18} />
                Nova subscrição
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

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ring-1 transition ${
                  isActive
                    ? "bg-cyan-500 text-white ring-cyan-500"
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {loading && subscriptions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="mt-4 text-sm text-slate-500">A carregar subscrições...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <EmptyState
            icon={<CalendarClock size={22} />}
            title="Sem subscrições"
            description="Nenhuma subscrição encontrada com o filtro aplicado."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Criar subscrição
              </button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">Estabelecimento</th>
                  <th className="px-6 py-3">Plano</th>
                  <th className="px-6 py-3">Período</th>
                  <th className="px-6 py-3">Renovação</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => {
                  const canEdit =
                    sub.status === "ACTIVE" || sub.status === "SUSPENDED";
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {sub.establishmentName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-cyan-600">
                          {sub.planCode}
                        </span>
                        <p className="text-sm text-slate-700">{sub.planName}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(sub.startDate).toLocaleString("pt-PT")}
                        <br />
                        <span className="text-slate-400">até</span>{" "}
                        {new Date(sub.endDate).toLocaleString("pt-PT")}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          label={sub.autoRenew ? "Automática" : "Manual"}
                          tone={sub.autoRenew ? "info" : "neutral"}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          label={STATUS_LABEL[sub.status]}
                          tone={STATUS_TONE[sub.status]}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => openEdit(sub)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>
                          )}
                          {sub.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(sub)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 size={14} />
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal criar/editar */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Editar subscrição" : "Nova subscrição"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Estabelecimento
                </label>
                <select
                  value={establishmentId}
                  onChange={(e) => setEstablishmentId(e.target.value)}
                  disabled={!!editing}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">Selecione...</option>
                  {establishmentOptions.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.tradeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Plano
                </label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Selecione...</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.code} · {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Início
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Fim
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <label className="sm:col-span-2 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                Renovação automática
              </label>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notas
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>
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

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancelar subscrição"
        description={`Tem a certeza que quer cancelar a subscrição de ${cancelTarget?.establishmentName ?? ""}? Esta ação não pode ser revertida.`}
        confirmLabel="Cancelar subscrição"
        cancelLabel="Voltar"
        tone="danger"
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}