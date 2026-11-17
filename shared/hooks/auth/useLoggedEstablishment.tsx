"use client";


import { getLoggedEstablishment } from "@/shared/service/auth/logged-establishment";
import { LoggedEstablishmentResponse } from "@/shared/types/auth/LoggedEstablishmentResponse";
import { useEffect, useState } from "react";

export function useLoggedEstablishment(establishmentId: string) {
  const [data, setData] = useState<LoggedEstablishmentResponse | null>(null);
  const [loading, setLoading] = useState(true); // 👈 ADICIONADO

  useEffect(() => {
    setLoading(true);
    getLoggedEstablishment(establishmentId)
      .then(setData)
      .finally(() => setLoading(false)); // 👈 ADICIONADO
  }, [establishmentId]);

  return { data, loading }; // 👈 ADICIONADO loading ao retorno
}