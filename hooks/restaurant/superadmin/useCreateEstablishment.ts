"use client";

import { useState } from "react";
import { establishmentService } from "@/service/restaurant/superadmin/establishment";
import { CreateEstablishmentRequest } from "@/types/restaurant/superadmin/establishments/createEstablishments";

export function useCreateEstablishment(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  async function create(data: CreateEstablishmentRequest) {
    try {
      setLoading(true);
      await establishmentService.create(data);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return { create, loading };
}