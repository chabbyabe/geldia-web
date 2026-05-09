import React from "react"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IAccountLog } from "@domain/entities/log/account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import LogsAccountView from "./logs-account.view"

interface ILogsAccountContainer {
  logs: IAccountLog[]
  pagination: IBasePagedListEntity
  handlePagination: (params: ILogSearchParams) => Promise<void>
}

export const LogsAccountContainer: React.FC<ILogsAccountContainer> = (props) => {
  return (
    <LogsAccountView
      logs={props.logs}
      pagination={props.pagination}
      handlePagination={props.handlePagination}
    />
  )
}

export default LogsAccountContainer
