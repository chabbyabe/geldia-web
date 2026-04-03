import { IPagedTransactionLogEntity } from "@domain/entities/log/paged-transaction-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"

export interface IRetrieveLogsTransactionDataGateway {
  retrieveLogs: (params: ILogSearchParams) => Promise<IPagedTransactionLogEntity>
}

export interface IRetrieveLogsTransactionDataRepository {
  initializeLogs: (logs: IPagedTransactionLogEntity, searchParams: ILogSearchParams) => void
}

export default class RetrieveLogsTransactionUseCase {
  constructor(
    private readonly dataGateway: IRetrieveLogsTransactionDataGateway,
    private readonly dataRepository: IRetrieveLogsTransactionDataRepository,
  ) {}

  async execute(params: ILogSearchParams) {
    try {
      const logs = await this.dataGateway.retrieveLogs(params)
      this.dataRepository.initializeLogs(logs, params)
    } catch (error) {
      throw error
    }
  }
}
