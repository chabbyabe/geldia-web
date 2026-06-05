export interface ITransactionSearchParams {
    page: number;
    search?: string;
    ordering?: string;
    accountId?: number
    filterModel?: string
    filterDate?: string
    startDate?: string
    endDate?: string
}
