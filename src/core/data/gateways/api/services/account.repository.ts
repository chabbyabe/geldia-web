import { IAccount } from "@domain/entities/account/account.entity"
import { IPagedAccountEntity } from "@domain/entities/account/paged.account.entity"
import { store } from "@interface/presenters/store/store"
import { addNewAccount, appendAccount, initializeAccounts, deleteAccount, setCurrentAccount, updateAccount } from "@interface/presenters/store/reducers/accounts.reducer"

export default class AccountRepository {
  setAccount(account: IAccount) {
    store.dispatch(addNewAccount(account))
  }

  setCurrentAccount(account: IAccount) {
    store.dispatch(setCurrentAccount(account.id))
  }
  updateAccount(account: IAccount) {
    store.dispatch(updateAccount(account))
  }

  deleteAccount() {
    store.dispatch(deleteAccount())
  }

  initializeAccounts(accounts: IPagedAccountEntity) {
    store.dispatch(initializeAccounts(accounts))
  }

  appendAccount(accounts: IPagedAccountEntity) {
    store.dispatch(appendAccount(accounts))
  }

}