import { IFormAccount } from '@domain/entities/formModels/account-form.entity'
import CreateAccountUseCase from '@domain/usecases/accounts/create-account.usecase'
import AccountApiGateway from '@data/gateways/api/services/account.gateway'
import RetrieveAccountUseCase from '@domain/usecases/accounts/retrieve-accounts.usecase'
import { store } from "@interface/presenters/store/store";
import AccountRepository from '@data/gateways/api/services/account.repository';
import { clearCurrentAccount } from '@interface/presenters/store/reducers/accounts.reducer';
import RetrieveUsersUseCase from '@domain/usecases/user/retrieve-users.usecase';
import UserApiGateway from '@data/gateways/api/services/user.gateway';
import UserApiRepository from '@data/gateways/api/services/user.repository';
import DeleteAccountUseCase from '@domain/usecases/accounts/delete-account.usecase';
import { IAccount } from '@domain/entities/account/account.entity';
import GetUserAccountUseCase from '@domain/usecases/accounts/get-account.usecase';
import UpdateAccountUseCase from '@domain/usecases/accounts/update-account.usecase';

export default class AccountsController {

  private readonly retrieveAccountsUseCase: RetrieveAccountUseCase
  private readonly createAccountUseCase: CreateAccountUseCase
  private readonly retrieveUsersUseCase: RetrieveUsersUseCase
  private readonly deleteAccountUseCase: DeleteAccountUseCase
  private readonly getAccountUseCase: GetUserAccountUseCase
  private readonly updateAccountUseCase: UpdateAccountUseCase

  constructor() {
    this.retrieveAccountsUseCase = new RetrieveAccountUseCase(
      new AccountApiGateway(),
      new AccountRepository()
    )
    this.createAccountUseCase = new CreateAccountUseCase(
      new AccountApiGateway(),
      new AccountRepository()
    )
    this.retrieveUsersUseCase = new RetrieveUsersUseCase(
      new UserApiGateway(),
      new UserApiRepository()
    )
    this.deleteAccountUseCase = new DeleteAccountUseCase(
      new AccountApiGateway(),
      new AccountRepository()
    )
    this.getAccountUseCase = new GetUserAccountUseCase(
      new AccountApiGateway(),
      new AccountRepository()
    )
    this.updateAccountUseCase = new UpdateAccountUseCase(
      new AccountApiGateway(),
      new AccountRepository()
    )
  }

  async retrieveAccount(initalizeList: boolean = true, page?: number) {
      await this.retrieveAccountsUseCase.execute(initalizeList, page)
  }

  removeCurrentAccount() {
    store.dispatch(clearCurrentAccount())
  }

  async createAccount(data: IFormAccount) {
    await this.createAccountUseCase.execute(data)
  }

  async setCurrentAccount(id: number) {
     await this.getAccountUseCase.execute(id)
  }

  async retrieveAllUsers() {
     await this.retrieveUsersUseCase.execute()
  }

  async deleteAccount(account: IAccount) {
     await this.deleteAccountUseCase.execute(account)
  }

  async updateAccount(id: number, data: IFormAccount) {
    await this.updateAccountUseCase.execute(id, data)
  }
}