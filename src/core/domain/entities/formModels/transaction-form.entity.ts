export interface IFormTransaction {
  name: string
  user: number | null
  account: number | null
  store?: string | null
  place?: string | null
  category?: string | null
  tags?: string[] | null
  transactionType: number | null
  amount: number | null
  notes: string  | null
  netAmount: number | null
  grossAmount: number | null
  debitMonthYear: string | null
  externalTransactionId: number | null
  pairTransaction: number | null
  isRecurring: boolean | false
  isRefunded: boolean | false
  refundedAt: string | null
  transactionAt: string | null
}
