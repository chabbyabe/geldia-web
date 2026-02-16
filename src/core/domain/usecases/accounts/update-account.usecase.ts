import { IFormAccount } from '@domain/entities/formModels/account-form.entity'
import { IAccount } from '@domain/entities/account/account.entity'
import { BadRequest } from '@base/core/data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'

export interface IUpdateAccountDataGateway {
  updateAccount: (id: number, account: IFormAccount) => Promise<any>
}

export interface IUpdateAccountRepository { 
  setCurrentAccount: (account: IAccount) => void
  updateAccount: (accounts: IAccount) => void
}

export default class UpdateAccountUseCase {
  constructor(
    private readonly dataGateway: IUpdateAccountDataGateway,
    private readonly dataRepository: IUpdateAccountRepository,
    
  ) {
  }
  async execute(id: number, accountData: IFormAccount) {
    try {
      const newData = await this.dataGateway.updateAccount(id, accountData)
      this.dataRepository.updateAccount(newData)
      this.dataRepository.setCurrentAccount(newData)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }
}