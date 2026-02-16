import { IAccount } from "@domain/entities/account/account.entity"


export interface IDeleteAccountDataGateway {
  deleteAccount: (account: IAccount) => Promise<any>
}

export interface IDeleteAccountDataRepository {
  deleteAccount: () => void
}

export default class DeleteAccountUseCase {
  constructor(
    private readonly dataGateway: IDeleteAccountDataGateway,
    private readonly dataRepository: IDeleteAccountDataRepository,
  ) {
  }
  async execute(account: IAccount) {
    try {
        await this.dataGateway.deleteAccount(account)
        await this.dataRepository.deleteAccount()
      
    } catch (error: any) {
      throw error
    }
  }
}