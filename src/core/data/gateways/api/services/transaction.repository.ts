import { IPagedTransactionEntity } from "@domain/entities/transaction/paged.transaction.entity"
import { store } from "@interface/presenters/store/store"
import { initializeTransactions } from "@interface/presenters/store/reducers/transactions.reducer"
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity"

export default class TransactionRepository {
  initializeTransactions(transactions: IPagedTransactionEntity, 
    params: ITransactionSearchParams) {
    store.dispatch(initializeTransactions({
      transactions: transactions,
      searchParams: params
    }))
  }
}