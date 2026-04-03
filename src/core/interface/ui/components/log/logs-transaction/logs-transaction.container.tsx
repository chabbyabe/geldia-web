import React from "react"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { ITransactionLog } from "@domain/entities/log/transaction-log.entity"
import LogsTransactionView from "./logs-transaction.view"

interface ILogsTransactionContainer {
  logs: ITransactionLog[]
  pagination: IBasePagedListEntity
  handlePagination: (params: ILogSearchParams) => Promise<void>
}

export const LogsTransactionContainer: React.FC<ILogsTransactionContainer> = (props) => {
  return (
    <LogsTransactionView
      logs={props.logs}
      pagination={props.pagination}
      handlePagination={props.handlePagination}
    />
  )
}

export default LogsTransactionContainer
