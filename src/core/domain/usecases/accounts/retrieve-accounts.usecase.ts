import { IPagedAccountEntity } from "@domain/entities/account/paged.account.entity"


export interface IGetAccountDataGateway {
  retrieveAccounts: (page?: number) => Promise<any>
}

export interface IGetAccountDataRepository {
  initializeAccounts: (accounts: IPagedAccountEntity) => void
  appendAccount: (accounts: IPagedAccountEntity) => void
}

export default class RetrieveUsersUseCase {
  constructor(
    private readonly dataGateway: IGetAccountDataGateway,
    private readonly dataRepository: IGetAccountDataRepository,
  ) {
  }
  async execute(initalizeList: boolean = true, page?: number) {
    try {
      const userAccounts = await this.dataGateway.retrieveAccounts(page)
      if (initalizeList) {
        await this.dataRepository.appendAccount(userAccounts)
      } else {
        await this.dataRepository.initializeAccounts(userAccounts)
      }
    } catch (error: any) {
      throw error
    }
  }
}