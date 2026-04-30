import { ITransactionImportResult } from "@domain/entities/transaction/transaction-import.entity"

export interface IImportTransactionsDataGateway {
  importTransactions: (file: File, accountId: number) => Promise<ITransactionImportResult>
}

export default class ImportTransactionsUseCase {
  constructor(
    private readonly dataGateway: IImportTransactionsDataGateway,
  ) {
  }

  async execute(file: File, accountId: number) {
    return await this.dataGateway.importTransactions(file, accountId)
  }
}
