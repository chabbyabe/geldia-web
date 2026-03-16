import TransactionApiGateway from "@data/gateways/api/services/transaction.gateway"
import TransactionRepository from "@data/gateways/api/services/transaction.repository"
import RetrieveTransactionFormOptionsUseCase from "@domain/usecases/transactions/retrieve-form-options.usecase"

export default class TransactionModalController {
  private readonly retrieveFormOptionsUseCase: RetrieveTransactionFormOptionsUseCase

  constructor() {
    this.retrieveFormOptionsUseCase = new RetrieveTransactionFormOptionsUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
  }

  async retrieveFormOptions() {
    await this.retrieveFormOptionsUseCase.execute()
  }
  
}