export interface IDeleteTransactionDataGateway {
  deleteTransaction: (transaction: number) => Promise<any>
}

export interface IDeleteTransactionDataRepository {
  deleteTransaction: () => void
}

export default class DeleteTransactionUseCase {
  constructor(
    private readonly dataGateway: IDeleteTransactionDataGateway,
    private readonly dataRepository: IDeleteTransactionDataRepository,
  ) {
  }
  async execute(transactionId: number) {
    try {
        await this.dataGateway.deleteTransaction(transactionId)
        await this.dataRepository.deleteTransaction()
    } catch (error: any) {
      throw error
    }
  }
}