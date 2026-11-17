"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, RefreshCw, Wallet } from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useHotelRoleGuard } from "@/hooks/hotel/useHotelRoleGuard";
import { useFindCashSessionById } from "@/hooks/hotel/cash/useFindCashSessionById";
import { useListCashMovements } from "@/hooks/hotel/cash/useListCashMovements";
import { HotelCashMovementModal } from "@/components/hotel/cash/HotelCashMovementModal";


const currency = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "MZN",
});

const dateTime = new Intl.DateTimeFormat("pt-PT", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AttendantCashSessionDetailPage() {
  useHotelRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string; sessionId: string }>();
  const { establishmentId, sessionId } = params;

  const session = useFindCashSessionById();
  const movements = useListCashMovements();
  const [movementOpen, setMovementOpen] = useState(false);

  const load = useCallback(async () => {
    await Promise.all([
      session.fetch(establishmentId, sessionId),
      movements.fetch(establishmentId, sessionId),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentId, sessionId]);

  useEffect(() => {
    void load();
  }, []);

  if (session.loading && !session.data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="space-y-4">
        <Link
          href={`/attendant/dashboard/${establishmentId}/hotel/cash`}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {session.error ?? "Sessão não encontrada."}
        </div>
      </div>
    );
  }

  const s = session.data;
  const balance = s.openingBalance + s.totalIn - s.totalOut;

  return (
    <div className="space-y-6 animate-fadeIn">
      <Link
        href={`/attendant/dashboard/${establishmentId}/hotel/cash`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <section className="rounded-2xl border border-borderLight bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-primary" />
              <h1 className="text-xl font-semibold text-primary">Caixa</h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                  s.closed
                    ? "bg-slate-100 text-slate-700 ring-slate-200"
                    : "bg-emerald-100 text-emerald-700 ring-emerald-200"
                }`}
              >
                {s.closed ? "Fechado" : "Aberto"}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Aberto por <strong>{s.openedByName}</strong> em{" "}
              {dateTime.format(new Date(s.openedAt))}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!s.closed && (
              <button
                type="button"
                onClick={() => setMovementOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Plus size={16} />
                Movimento
              </button>
            )}
            <button
              type="button"
              onClick={load}
              disabled={session.loading || movements.loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  session.loading || movements.loading ? "animate-spin" : ""
                }
              />
              Atualizar
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Sum label="Inicial">{currency.format(s.openingBalance)}</Sum>
          <Sum label="Entradas" tone="emerald">
            +{currency.format(s.totalIn)}
          </Sum>
          <Sum label="Saídas" tone="rose">
            -{currency.format(s.totalOut)}
          </Sum>
          <Sum label="Saldo">{currency.format(balance)}</Sum>
        </div>
      </section>

      {movements.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {movements.error}
        </div>
      )}

      {movements.loading && movements.data.length === 0 ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : movements.data.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Sem movimentos</h3>
          <p className="mt-2 text-sm text-gray-500">
            Registar o primeiro movimento no botão acima.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-borderLight bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.data.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-600">
                    {dateTime.format(new Date(m.movementTime))}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {m.movementTypeName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {m.paymentMethodName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {m.description ?? "—"}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      m.isInflow ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {m.isInflow ? "+" : "-"}
                    {currency.format(m.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <HotelCashMovementModal
        open={movementOpen}
        establishmentId={establishmentId}
        sessionId={sessionId}
        onClose={() => setMovementOpen(false)}
        onCreated={async () => {
          setMovementOpen(false);
          await load();
        }}
      />
    </div>
  );
}

function Sum({
  label,
  children,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  tone?: "emerald" | "rose";
}) {
  const color =
    tone === "emerald"
      ? "text-emerald-600"
      : tone === "rose"
        ? "text-rose-600"
        : "text-gray-900";
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold ${color}`}>{children}</p>
    </div>
  );
}