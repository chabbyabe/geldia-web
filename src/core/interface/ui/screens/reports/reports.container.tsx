import React, { useCallback, useMemo } from 'react';
import { useAppSelector } from '@interface/presenters/store/hooks';
import ReportsView from './reports.view';
import ReportsController from './reports.controller';

export interface IReportsContainerViewModel {
  children?: React.ReactNode
}

export const ReportsContainer: React.FC<IReportsContainerViewModel> = (props) => {
  const controller = useMemo(() => new ReportsController(), []);
  const incomeReport = useAppSelector(state => state.reportState.incomeReport);
  const exportReport = useCallback(
    controller.exportReport.bind(controller),
    [controller]
  );

  return <ReportsView
    children={props.children}
    incomeReport={incomeReport}
    exportReport={exportReport}
  />
}
