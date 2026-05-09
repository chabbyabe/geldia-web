import React from "react";
import { IBasePagedListEntity } from "@domain/entities/base/base.paged.entity";
import { ILogSearchParams } from "@domain/entities/log/search.entity";
import { ITransactionLog } from "@domain/entities/log/transaction-log.entity";
import { BaseLayoutContainer } from "@interface/ui/components/common/layouts/base-layout/base-layout.container";
import { PAGES } from "@interface/presenters/constants";
import { LogsTransactionContainer } from "@interface/ui/components/log/logs-transaction/logs-transaction.container";

interface ILogsViewModel {
  logs: ITransactionLog[]
  pagination: IBasePagedListEntity
  handlePagination: (params: ILogSearchParams) => Promise<void>
}

const LogsView: React.FC<ILogsViewModel> = (props) => {
  return (
    <BaseLayoutContainer
      currentPage={PAGES.LOGS_TRANSACTIONS.label}
      sidebarCurrentPage={PAGES.LOGS_TRANSACTIONS.label}
    >
      <LogsTransactionContainer
        logs={props.logs}
        pagination={props.pagination}
        handlePagination={props.handlePagination}
      />
    </BaseLayoutContainer>
  );
};

export default LogsView;
