import React, { useCallback, useMemo } from "react"
import { useAppSelector } from "@interface/presenters/store/hooks"
import LogsAccountsView from "./logs-accounts.view"
import LogsAccountsController from "./logs-accounts.controller"

export const LogsAccountsContainer: React.FC = () => {
  const controller = useMemo(() => new LogsAccountsController(), [])
  const logs = useAppSelector((state) => state.logsState.accountLogs)
  const pagination = useAppSelector((state) => state.logsState.accountPagination)
  const handlePagination = useCallback(async (...args: Parameters<LogsAccountsController["retrieveLogs"]>) => {
    await controller.retrieveLogs(...args)
  }, [controller])

  return <LogsAccountsView
    logs={logs}
    pagination={pagination}
    handlePagination={handlePagination}
  />
}
