import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPagedTransactionEntity } from "@domain/entities/transaction/paged.transaction.entity";
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity";
import { ITransactionSearchParams } from "@domain/entities/transaction/search.entity";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";

interface ITransactionState {
  transactions: ITransaction[] | [],
  currentTransaction: ITransaction | null
  nextTransactionsPage: string | null,
  pagination: IBasePagedListEntity
  searchParams: ITransactionSearchParams,
}

const initialState: ITransactionState = {
  transactions: [],
  currentTransaction: null,
  nextTransactionsPage: null,
  pagination: {
    count: 0,
    totalPages: 1,
    currentPageNumber: 1,
    next: null,
    previous: null
  },
  searchParams : {
    page: 1,
    search: '',
    ordering: '',
    filterModel: ''
  }
}

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    initializeTransactions(state, action: PayloadAction<{
      transactions: IPagedTransactionEntity,
      searchParams: ITransactionSearchParams
      }>){
      const data = action.payload;
      let transactions: ITransaction[] = []
      data.transactions.results.forEach((result: ITransaction) => {
        transactions.push(result)
      })
      state.transactions = transactions
      state.nextTransactionsPage = data.transactions.next
      state.pagination = (({ results, ...rest }) => rest)(data.transactions);
      state.searchParams = {
        page: data.transactions.currentPageNumber,
        search:data.searchParams?.search ?? '',
        ordering: data.searchParams?.ordering ?? '',
        filterModel: data.searchParams?.filterModel ?? ''
      }
    },
    setCurrentTransaction(state, action: PayloadAction<number>) {
      state.currentTransaction = state.transactions.find(
        transaction => Number(transaction.id) === Number(action.payload)
      ) ?? null;
    },
    clearCurrentTransaction(state) {
      state.currentTransaction = null;
    },
    addNewTransaction(state, action: PayloadAction<ITransaction>) {
      const newTransaction = action.payload
      state.transactions = [newTransaction,...state.transactions]
    },

    updateTransaction(state, action: PayloadAction<ITransaction>) {
      const updatedTransaction = action.payload;
      state.transactions = state.transactions.map(transaction =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      );
    },
    deleteTransaction(state) {
      const transactionId = state.currentTransaction?.id;
      state.transactions = state.transactions.filter(transaction => transaction.id !== transactionId);
      state.currentTransaction = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  initializeTransactions,
  setCurrentTransaction,
  clearCurrentTransaction,
  addNewTransaction,
  updateTransaction,
  deleteTransaction
} = transactionSlice.actions
export default transactionSlice.reducer