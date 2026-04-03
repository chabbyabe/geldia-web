import LogsTransactionApiGateway from "@data/gateways/api/services/logs-transaction.gateway"
import LogsTransactionRepository from "@data/gateways/api/services/logs-transaction.repository"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import RetrieveLogsTransactionUseCase from "@domain/usecases/log/retrieve-logs-transaction.usecase"

export default class LogsController {
  private readonly retrieveLogsTransactionUseCase: RetrieveLogsTransactionUseCase

  constructor() {
    this.retrieveLogsTransactionUseCase = new RetrieveLogsTransactionUseCase(
      new LogsTransactionApiGateway(),
      new LogsTransactionRepository()
    )
  }

  async retrieveLogs(params: ILogSearchParams) {
    await this.retrieveLogsTransactionUseCase.execute(params)
  }
}
