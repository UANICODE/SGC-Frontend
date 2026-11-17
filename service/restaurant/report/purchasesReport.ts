
import api from "@/service/api";
import { PurchaseFilterRequest, PurchaseReportResponse } from "@/types/restaurant/admin/report";

export async function getPurchasesReport(
    payload: PurchaseFilterRequest
): Promise<PurchaseReportResponse> {
    const { data } = await api.post<PurchaseReportResponse>(
        "/api/admin/reports/purchases",
        payload
    );
    console.log("data", data);
    return data;
}