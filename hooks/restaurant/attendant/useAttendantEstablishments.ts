"use client";

import { useEffect, useState } from "react";
import { listAttendantEstablishments } from "@/service/restaurant/attendant/establishment";
import { AttendantEstablishmentItem } from "@/types/restaurant/attendant/establishment.types";

export function useAttendantEstablishments() {
  const [data, setData] = useState<AttendantEstablishmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    try {
      setLoading(true);
      const res = await listAttendantEstablishments();
      setData(res || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading };
}