import { listUserEstablishments } from "@/service/restaurant/admin/listUserEstablishments";
import { useState } from "react";

export function useUserEstablishments() {
  const [data, setData] = useState([]);

  async function fetchAll() {
    const res = await listUserEstablishments();
    setData(res || []);
  }

  return { data, fetchAll };
}