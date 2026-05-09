import React from "react"
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity"
import { IAccountLog } from "@domain/entities/log/account-log.entity"
import { ILogSearchParams } from "@domain/entities/log/search.entity"
import { BaseLayoutContainer } from "@interface/ui/components/common/layouts/base-layout/base-layout.container"
import { PAGES } from "@interface/presenters/constants"
import { LogsAccountContainer } from "@interface/ui/components/log/logs-account/logs-account.container"

interface ILogsAccountsViewModel {
  logs: IAccountLog[]
  pagination: IBasePagedListEntity
  handlePagination: (params: ILogSearchParams) => Promise<void>
}

const LogsAccountsView: React.FC<ILogsAccountsViewModel> = (props) => {
  return (
    <BaseLayoutContainer
      currentPage={PAGES.LOGS_ACCOUNTS.label}
      sidebarCurrentPage={PAGES.LOGS_ACCOUNTS.label}
    >
      <LogsAccountContainer
        logs={props.logs}
        pagination={props.pagination}
        handlePagination={props.handlePagination}
      />
    </BaseLayoutContainer>
  )
}

export default LogsAccountsView
