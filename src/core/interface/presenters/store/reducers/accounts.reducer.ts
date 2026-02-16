import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAccount } from "@domain/entities/account/account.entity";
import { IPagedAccountEntity } from "@domain/entities/account/paged.account.entity";
import { IBasePagedListEntity } from "@base/core/domain/entities/base/base.paged.entity";


interface IAccountState {
  accounts: IAccount[] | [],
  currentAccount: IAccount | undefined
  nextAccountsPage: string | null,
  pagination: IBasePagedListEntity
}

const initialState: IAccountState = {
  accounts: [],
  currentAccount: undefined,
  nextAccountsPage: null,
  pagination: {
    count: 0,
    totalPages: 1,
    currentPageNumber: 1,
    next: null,
    previous: null
  }
}

export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addNewAccount(state, action: PayloadAction<IAccount>) {
      const newAccount = action.payload
      state.accounts = [...state.accounts, newAccount]
    },

    updateAccount(state, action: PayloadAction<IAccount>) {
      const updatedAccount = action.payload;
      state.accounts = state.accounts.map(account =>
        account.id === updatedAccount.id ? updatedAccount : account
      );
    },
    deleteAccount(state) {
      const accountId = state.currentAccount?.id;
      state.accounts = state.accounts.filter(
        account => account.id !== accountId
      )
    },
    initializeAccounts(state, action: PayloadAction<IPagedAccountEntity>) {
      let accounts: IAccount[] = []
      action.payload.results.forEach((result: IAccount) => {
        accounts.push(result)
      })
      state.accounts = accounts
      state.nextAccountsPage = action.payload.next
      state.pagination = (({ results, ...rest }) => rest)(action.payload);
    },
    setCurrentAccount(state, action: PayloadAction<number>) {
      state.currentAccount = state.accounts.find(account => Number(account.id) === Number(action.payload));
    },
    clearCurrentAccount(state) {
      state.currentAccount = undefined;
    },
    appendAccount(state, action: PayloadAction<IPagedAccountEntity>) {
      let accounts: IAccount[] = []
      action.payload.results.forEach((result: IAccount) => {
        accounts.push(result)
      })
      state.accounts = accounts
      state.nextAccountsPage = action.payload.next
      state.pagination = (({ results, ...rest }) => rest)(action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  addNewAccount,
  deleteAccount,
  initializeAccounts,
  appendAccount,
  setCurrentAccount,
  clearCurrentAccount,
  updateAccount
} = accountSlice.actions
export default accountSlice.reducer