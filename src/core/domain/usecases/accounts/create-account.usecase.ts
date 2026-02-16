import { IFormAccount } from '@domain/entities/formModels/account-form.entity'
import { IAccount } from '@domain/entities/account/account.entity'

export interface ICreateAccountDataGateway {
  createAccount: (account: IFormAccount) => Promise<any>
}

export interface ICreateAccountRepository {
  setAccount: (accounts: IAccount) => void
}

export default class CreateAccountUseCase {
  constructor(
    private readonly dataGateway: ICreateAccountDataGateway,
    private readonly dataRepository: ICreateAccountRepository,
    
  ) {
  }
  async execute(accountData: IFormAccount) {
    const newData = await this.dataGateway.createAccount(accountData)
    await this.dataRepository.setAccount(newData)
  }
}