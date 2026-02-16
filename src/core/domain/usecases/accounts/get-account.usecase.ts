import { IAccount } from "@domain/entities/account/account.entity"


export interface IGetAccountDataGateway {
  getUserAccount: (page?: number) => Promise<any>
}

export interface IGetAccountDataRepository {
  setCurrentAccount: (accounts: IAccount) => void
}

export default class GetUserAccountUseCase {
  constructor(
    private readonly dataGateway: IGetAccountDataGateway,
    private readonly dataRepository: IGetAccountDataRepository,
  ) {
  }
  async execute(accountId: number) {
    try {
      const userAccount = await this.dataGateway.getUserAccount(accountId)
        await this.dataRepository.setCurrentAccount(userAccount)
      
    } catch (error: any) {
      throw error
    }
  }
}