"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Plus,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useListCashSessions } from "@/hooks/hotel/cash/useListCashSessions";
import { useOpenCashSession } from "@/hooks/hotel/cash/useOpenCashSession";
import { useCloseCashSession } from "@/hooks/hotel/cash/useCloseCashSession";
import { useToast } from "@/ context/ToastContext";
import { ConfirmDialog } from "@/components/hotel/shared/ConfirmDialog";
import { HotelOpenCashModal } from "@/components/hotel/cash/HotelOpenCashModal";
import { HotelCashMovementModal } from "@/components/hotel/cash/HotelCashMovementModal";


const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AttendantCashPage() {
  useHotelRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();

  const { data: sessions, loading, error, fetch } = useListCashSessions();
  const openCash = useOpenCashSession();
  const closeCash = useCloseCashSession();

  const [openFormOpen, setOpenFormOpen] = useState(false);
  const [movementSessionId, setMovementSessionId] = useState<string | null>(null);
  const [closeTarget, setCloseTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    await fetch(establishmentId);
  }, [fetch, establishmentId]);

  useEffect(() => {
    void load();
  }, []);

  const activeOpen = useMemo(
    () => sessions.filter((s) => !s.closed),
    [sessions],
  );

  async function handleOpen(balance: number) {
    try {
      await openCash.open(establishmentId, { openingBalance: balance });
      showToast("Caixa aberto.", "success");
      setOpenFormOpen(false);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao abrir caixa.", "error");
    }
  }

  async function handleClose() {
    if (!closeTarget) return;
    try {
      await closeCash.close(establishmentId, { sessionId: closeTarget });
      showToast("Caixa fechado.", "success");
      setCloseTarget(null);
      await load();
    } catch (err: any) {
      showToast(err?.message || "Falha ao fechar caixa.", "error");
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Caixa</h1>
              <p className="text-sm text-gray-500">
                {activeOpen.length} aberto(s) · {sessions.length} total
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpenFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Plus size={16} />
              Abrir caixa
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
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && sessions.length === 0 ? (
        <SkeletonGrid />
      ) : sessions.length === 0 ? (
        <Empty onOpen={() => setOpenFormOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {sessions.map((s) => {
            const balance = s.openingBalance + s.totalIn - s.totalOut;
            return (
              <article
                key={s.id}
                className="rounded-2xl border border-borderLight bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Caixa
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {s.openedByName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dateTime.format(new Date(s.openedAt))}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                      s.closed
                        ? "bg-slate-100 text-slate-700 ring-slate-200"
                        : "bg-emerald-100 text-emerald-700 ring-emerald-200"
                    }`}
                  >
                    {s.closed ? (
                      <>
                        <Lock size={12} /> Fechado
                      </>
                    ) : (
                      "Aberto"
                    )}
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-gray-50 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500">
                    Saldo
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {currency.format(balance)}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!s.closed && (
                    <>
                      <button
                        type="button"
                        onClick={() => setMovementSessionId(s.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                      >
                        <Plus size={14} />
                        Movimento
                      </button>
                      <button
                        type="button"
                        onClick={() => setCloseTarget(s.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        <CheckCircle2 size={14} />
                        Fechar
                      </button>
                    </>
                  )}
                  <Link
                    href={`/attendant/dashboard/${establishmentId}/hotel/cash/${s.id}`}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Movimentos
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <HotelOpenCashModal
        open={openFormOpen}
        onClose={() => setOpenFormOpen(false)}
        onSubmit={handleOpen}
        loading={openCash.loading}
      />

      {movementSessionId && (
        <HotelCashMovementModal
          open={!!movementSessionId}
          establishmentId={establishmentId}
          sessionId={movementSessionId}
          onClose={() => setMovementSessionId(null)}
          onCreated={async () => {
            setMovementSessionId(null);
            await load();
          }}
        />
      )}

      <ConfirmDialog
        open={!!closeTarget}
        title="Fechar caixa"
        description="Confirma o fecho? Esta ação não pode ser desfeita."
        confirmLabel="Fechar caixa"
        tone="danger"
        loading={closeCash.loading}
        onConfirm={handleClose}
        onClose={() => setCloseTarget(null)}
      />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
      ))}
    </div>
  );
}

function Empty({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <Wallet size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Nenhum caixa registado
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Abra o primeiro caixa do turno para começar a registar movimentos.
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Abrir caixa
      </button>
    </div>
  );
}