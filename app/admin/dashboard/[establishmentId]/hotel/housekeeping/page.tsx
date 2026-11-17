"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
  Sparkles,
  UserCog,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListHousekeepingTasks } from "@/hooks/hotel/housekeeping/useListHousekeepingTasks";
import { useCompleteHousekeepingTask } from "@/hooks/hotel/housekeeping/useCompleteHousekeepingTask";

import { StatusBadge } from "@/components/hotel/shared/StatusBadge";
import { ConfirmDialog } from "@/components/hotel/shared/ConfirmDialog";


import { HOUSEKEEPING_STATUS } from "@/types/hotel/catalogs";
import type { HousekeepingStatusCode, HousekeepingTask } from "@/types/hotel";
import { useToast } from "@/ context/ToastContext";
import { HotelHousekeepingCreateModal } from "@/components/hotel/housekeeping/HotelHousekeepingCreateModal";
import { HotelHousekeepingAssignModal } from "@/components/hotel/housekeeping/HotelHousekeepingAssignModal";

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

const FILTERS: Array<{ value: HousekeepingStatusCode; label: string }> = [
  { value: "PENDING", label: "Pendentes" },
  { value: "IN_PROGRESS", label: "Em curso" },
  { value: "COMPLETED", label: "Concluídas" },
  { value: "CANCELLED", label: "Canceladas" },
];

export default function HotelHousekeepingPage() {
  useHotelRoleGuard([UserRole.ADMIN]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();

  const { data: tasks, loading, error, fetch } = useListHousekeepingTasks();
  const { complete, loading: completing } = useCompleteHousekeepingTask();

  const [status, setStatus] = useState<HousekeepingStatusCode>("PENDING");
  const [createOpen, setCreateOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<HousekeepingTask | null>(null);
  const [completeTarget, setCompleteTarget] = useState<HousekeepingTask | null>(
    null,
  );

  const load = useCallback(async () => {
    await fetch(establishmentId, status);
  }, [fetch, establishmentId, status]);

  useEffect(() => {
    void load();
  }, []);

  async function handleComplete() {
    if (!completeTarget) return;
    try {
      await complete(establishmentId, completeTarget.id);
      showToast("Tarefa concluída.", "success");
      setCompleteTarget(null);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao concluir tarefa.", "error");
    }
  }

  const canComplete = (task: HousekeepingTask) =>
    task.statusCode === "PENDING" || task.statusCode === "IN_PROGRESS";

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">
                Housekeeping
              </h1>
              <p className="text-sm text-gray-500">
                {tasks.length} tarefa(s) em <strong>{labelFor(status)}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Plus size={16} />
              Nova tarefa
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          {FILTERS.map((f) => {
            const active = status === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatus(f.value)}
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

      {loading && tasks.length === 0 ? (
        <SkeletonList />
      ) : tasks.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-borderLight bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Quarto</th>
                <th className="px-4 py-3">Atribuída a</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Criada</th>
                <th className="px-4 py-3">Notas</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((t) => {
                const meta = HOUSEKEEPING_STATUS[t.statusCode];
                return (
                  <tr key={t.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      Nº {t.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {t.assignedToName ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={meta.label} tone={meta.tone} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {dateTime.format(new Date(t.taskCreatedAt))}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {t.notes ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAssignTarget(t)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <UserCog size={14} />
                          Atribuir
                        </button>
                        {canComplete(t) && (
                          <button
                            type="button"
                            onClick={() => setCompleteTarget(t)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle2 size={14} />
                            Concluir
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

      <HotelHousekeepingCreateModal
        open={createOpen}
        establishmentId={establishmentId}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          setCreateOpen(false);
          await load();
        }}
      />

      {assignTarget && (
        <HotelHousekeepingAssignModal
          open={!!assignTarget}
          establishmentId={establishmentId}
          task={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={async () => {
            setAssignTarget(null);
            await load();
          }}
        />
      )}

      <ConfirmDialog
        open={!!completeTarget}
        title="Concluir tarefa"
        description={`Confirma a conclusão da limpeza do quarto Nº ${completeTarget?.roomNumber ?? ""}? O quarto passará a disponível.`}
        confirmLabel="Concluir"
        cancelLabel="Voltar"
        tone="primary"
        loading={completing}
        onConfirm={handleComplete}
        onClose={() => setCompleteTarget(null)}
      />
    </div>
  );
}

function labelFor(status: HousekeepingStatusCode) {
  return HOUSEKEEPING_STATUS[status].label;
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <Sparkles size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Sem tarefas neste estado
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Crie uma nova tarefa de limpeza ou ajuste o filtro.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Criar tarefa
      </button>
    </div>
  );
}