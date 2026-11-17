// components/admin/modals/CashRegisterSalesModal.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { CashRegisterSale } from "@/types/restaurant/admin/cash-register";
import {
  XMarkIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  CalendarIcon,
  CreditCardIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  BanknotesIcon,
  TagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  onClose: () => void;
  sales: CashRegisterSale[];
  loading: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  establishmentLogo?: string;
  establishmentName?: string;
  establishmentAddress?: string;
  establishmentPhone?: string;
  cashRegisterInfo?: {
    openedAt: string;
    closedAt?: string;
    totalSales: number;
  };
}

export function CashRegisterSalesModal({
  open,
  onClose,
  sales,
  loading,
  primaryColor = "#4f46e5",
  secondaryColor = "#7c3aed",
  establishmentLogo,
  cashRegisterInfo,
  establishmentName,
  establishmentAddress,
  establishmentPhone,
}: Props) {
  const [openSale, setOpenSale] = useState<string | null>(null);
  const [method, setMethod] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [date, setDate] = useState("");
  const [searchItems, setSearchItems] = useState<Record<string, string>>({});
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [currentAttendantName, setCurrentAttendantName] = useState<string>("");

  useEffect(() => {
    if (sales.length > 0 && sales[0].attendantName) {
      setCurrentAttendantName(sales[0].attendantName);
    }
  }, [sales]);

  useEffect(() => {
    if (establishmentLogo) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = establishmentLogo;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        setLogoImage(canvas.toDataURL("image/png"));
      };
    }
  }, [establishmentLogo]);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchMethod = method ? s.paymentMethod === method : true;
      const matchMin = min ? s.total >= Number(min) : true;
      const matchMax = max ? s.total <= Number(max) : true;
      const matchDate = date
        ? new Date(s.createdAt).toISOString().slice(0, 10) === date
        : true;
      return matchMethod && matchMin && matchMax && matchDate;
    });
  }, [sales, method, min, max, date]);

  const methods = [
    ...new Set(sales.map((s) => s.paymentMethod).filter(Boolean)),
  ];

  const hasFilters = method || min || max || date;

  const clearFilters = () => {
    setMethod("");
    setMin("");
    setMax("");
    setDate("");
  };

  const totalVendas = filteredSales.length;
  const totalReceita = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDesconto = filteredSales.reduce(
    (sum, sale) => sum + sale.discount,
    0
  );

  // 🆕 Lucro: se TODAS as vendas filtradas têm profit === null → null.
  // Caso contrário, soma as que têm (vendas antigas contribuem 0).
  const salesWithProfit = filteredSales.filter(
    (s) => s.profit !== null && s.profit !== undefined
  );
  const totalLucro: number | null =
    salesWithProfit.length === 0
      ? null
      : salesWithProfit.reduce((sum, s) => sum + (s.profit ?? 0), 0);

  const exportToPDF = () => {
    // ... (mantém a implementação atual do PDF; se quiseres incluir o lucro
    //     no PDF, adiciona um 4º card em doc.rect. Não incluído aqui para
    //     não inflacionar a resposta.)
  };

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-7xl rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-10 rounded-t-2xl px-6 py-4"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Vendas do Caixa</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cards de Resumo — agora 4 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <BanknotesIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">
                  Total de Vendas
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{totalVendas}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">
                  Receita Total
                </span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                MZN {totalReceita.toFixed(2)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <TagIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">
                  Descontos
                </span>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                MZN {totalDesconto.toFixed(2)}
              </p>
            </div>
            {/* 🆕 Lucro */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <ArrowTrendingUpIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">
                  Lucro Total
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  totalLucro === null
                    ? "text-gray-400"
                    : totalLucro >= 0
                      ? "text-emerald-700"
                      : "text-red-700"
                }`}
              >
                {totalLucro === null
                  ? "Indisponível"
                  : `MZN ${totalLucro.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <FunnelIcon className="w-5 h-5" />
                <span>Filtros</span>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Todos os métodos</option>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Valor minimo"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor maximo"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div
                className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent"
                style={{
                  borderColor: `${primaryColor}20`,
                  borderTopColor: primaryColor,
                }}
              ></div>
            </div>
          )}

          {/* Sem resultados */}
          {!loading && filteredSales.length === 0 && (
            <div className="text-center py-10">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600">
                Nenhuma venda encontrada
              </p>
              <p className="text-sm text-gray-400">
                Tente ajustar os filtros aplicados
              </p>
            </div>
          )}

          {/* Lista de Vendas */}
          {!loading && filteredSales.length > 0 && (
            <div className="space-y-4">
              {filteredSales.map((sale) => {
                const search = searchItems[sale.saleNumber] || "";
                const items = sale.items.filter((i) =>
                  i.productName.toLowerCase().includes(search.toLowerCase())
                );
                const saleNumberStr = sale.saleNumber.toString();
                return (
                  <div
                    key={saleNumberStr}
                    className="border rounded-xl overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setOpenSale(
                          openSale === saleNumberStr ? null : saleNumberStr
                        )
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: "#10b981" }}
                            ></div>
                            <p className="font-mono text-sm font-semibold text-gray-700">
                              Venda #{saleNumberStr.slice(0, 8)}
                            </p>
                          </div>
                          {sale.paymentMethod ? (
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <CreditCardIcon className="w-4 h-4" />
                              {sale.paymentMethod}
                            </p>
                          ) : null}
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(sale.createdAt).toLocaleString()}
                            </span>
                            {sale.attendantName && (
                              <span>Atendente: {sale.attendantName}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-lg font-bold"
                            style={{ color: primaryColor }}
                          >
                            MZN {sale.total.toFixed(2)}
                          </p>
                          {sale.discount > 0 && (
                            <p className="text-xs text-green-600">
                              Desconto: MZN {sale.discount.toFixed(2)}
                            </p>
                          )}
                          {/* 🆕 Lucro desta venda */}
                          {sale.profit !== null && sale.profit !== undefined && (
                            <p
                              className={`text-xs font-medium ${
                                sale.profit >= 0
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              Lucro: MZN {sale.profit.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            openSale === saleNumberStr ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                    {openSale === saleNumberStr && (
                      <div className="border-t bg-gray-50 p-4 space-y-3">
                        <input
                          type="text"
                          placeholder="Buscar produto..."
                          value={search}
                          onChange={(e) =>
                            setSearchItems({
                              ...searchItems,
                              [saleNumberStr]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        />
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div
                              key={i}
                              className="bg-white rounded-lg p-3 flex items-center gap-3"
                            >
                              <img
                                src={item.imageUrl || "/placeholder.png"}
                                alt={item.productName}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.png";
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity} x MZN{" "}
                                  {item.unitPrice.toFixed(2)}
                                </p>
                              </div>
                              <p
                                className="font-semibold text-sm"
                                style={{ color: primaryColor }}
                              >
                                MZN {item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        {items.length === 0 && (
                          <p className="text-sm text-gray-400 text-center py-4">
                            Nenhum produto encontrado
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}