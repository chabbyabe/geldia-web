import { ITransactionInitial } from "@domain/entities/transaction/initial.entity"

export interface IRetrieveFormOptionsDataGateway {
  retrieveFormInitialData: () => Promise<any>
}

export interface IRetrieveFormOptionsDataRepository {
  retrieveFormInitialData: (options : ITransactionInitial) => void
}

export default class RetrieveTransactionFormOptionsUseCase {
  constructor(
    private readonly dataGateway: IRetrieveFormOptionsDataGateway,
    private readonly dataRepository: IRetrieveFormOptionsDataRepository,
  ) {
  }
  async execute() {
    try {
      const data = await this.dataGateway.retrieveFormInitialData()
      this.dataRepository.retrieveFormInitialData(data)
    } catch (error: any) {
      throw error
    }
  }
}