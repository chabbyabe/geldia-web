import { IPagedAccountLogEntity } from "@domain/entities/log/paged-account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"

export interface IRetrieveLogsAccountDataGateway {
  retrieveLogs: (params: ILogSearchParams) => Promise<IPagedAccountLogEntity>
}

export interface IRetrieveLogsAccountDataRepository {
  initializeLogs: (logs: IPagedAccountLogEntity, searchParams: ILogSearchParams) => void
}

export default class RetrieveLogsAccountUseCase {
  constructor(
    private readonly dataGateway: IRetrieveLogsAccountDataGateway,
    private readonly dataRepository: IRetrieveLogsAccountDataRepository,
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
