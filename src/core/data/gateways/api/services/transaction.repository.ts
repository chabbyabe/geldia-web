import { IPagedTransactionEntity } from "@domain/entities/transaction/paged.transaction.entity"
import { store } from "@interface/presenters/store/store"
import { initializeTransactions, setCurrentTransaction
, addNewTransaction, updateTransaction
 } from "@interface/presenters/store/reducers/transactions.reducer"
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity"
import { ITransaction } from "@base/core/domain/entities/transaction/transaction.entity"

export default class TransactionRepository {
  initializeTransactions(transactions: IPagedTransactionEntity, 
    params: ITransactionSearchParams) {
    store.dispatch(initializeTransactions({
      transactions: transactions,
      searchParams: params
    }))
  }
  setCurrentTransaction(transaction: ITransaction) {
    store.dispatch(setCurrentTransaction(transaction.id))
  }
  setTransaction(transaction: ITransaction) {
    store.dispatch(addNewTransaction(transaction))
  }
  updateTransaction(transaction: ITransaction) {
    store.dispatch(updateTransaction(transaction))
  }
}