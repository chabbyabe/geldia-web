import LogsAccountApiGateway from "@data/gateways/api/services/logs-account.gateway"
import LogsAccountRepository from "@data/gateways/api/services/logs-account.repository"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import RetrieveLogsAccountUseCase from "@domain/usecases/log/retrieve-logs-account.usecase"

export default class LogsAccountsController {
  private readonly retrieveLogsAccountUseCase: RetrieveLogsAccountUseCase

  constructor() {
    this.retrieveLogsAccountUseCase = new RetrieveLogsAccountUseCase(
      new LogsAccountApiGateway(),
      new LogsAccountRepository()
    )
  }

  async retrieveLogs(params: ILogSearchParams) {
    await this.retrieveLogsAccountUseCase.execute(params)
  }
}
