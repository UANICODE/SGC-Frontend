"use client";

import { useState } from "react";
import { editRole } from "@/service/restaurant/superadmin/users/editRole";

export function useEditRole() {
  const [loading, setLoading] = useState(false);

  async function execute(roleId: number, name: string) {
    try {
      setLoading(true);

      return await editRole(roleId, {
        name,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}