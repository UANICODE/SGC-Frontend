import api from "@/service/api";
import { LoggedEstablishmentResponse } from "@/shared/types/auth/LoggedEstablishmentResponse";

export async function getLoggedEstablishment(establishmentId: string) {
  const response = await api.get<LoggedEstablishmentResponse>(
    "/api/me/establishment",
    {
      params: { establishmentId }, // ✅ agora como query parameter
    }
  );

  return response.data;
}