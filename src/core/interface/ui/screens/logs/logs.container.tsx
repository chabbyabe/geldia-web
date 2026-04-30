import React, { useCallback, useMemo } from "react";
import { useAppSelector } from "@interface/presenters/store/hooks";
import LogsView from "./logs.view";
import LogsController from "./logs.controller";

export const LogsContainer: React.FC = () => {
  const controller = useMemo(() => new LogsController(), [])
  const logs = useAppSelector((state) => state.logsState.logs)
  const pagination = useAppSelector((state) => state.logsState.pagination)
  const handlePagination = useCallback(async (...args: Parameters<LogsController["retrieveLogs"]>) => {
    await controller.retrieveLogs(...args)
  }, [controller])

  return <LogsView
    logs={logs}
    pagination={pagination}
    handlePagination={handlePagination}
  />;
};
