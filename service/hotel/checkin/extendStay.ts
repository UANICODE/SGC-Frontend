import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import type { ExtendStayInput, HotelApiRole, StayExtension } from "@/types/hotel";

const PREFIX: Record<HotelApiRole, string> = {
  admin: "admin",
  attendant: "attendant",
};

export async function extendStay(
  establishmentId: string,
  input: ExtendStayInput,
  role: HotelApiRole = "admin",
): Promise<StayExtension> {
  try {
    const { data } = await api.post<StayExtension>(
      `/api/${PREFIX[role]}/hotel/establishments/${establishmentId}/extensions`,
      input,
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}