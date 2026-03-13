import { useAppSelector } from '@interface/presenters/store/hooks';
import DashboardView from '@interface/ui/screens/dashboard/dashboard.view'
import DashboardController from './dashboard.controller';
import { useEffect } from 'react';

export interface IDashboardContainerViewModel {
  children?: React.ReactNode
}

export const DashboardContainer: React.FC<IDashboardContainerViewModel> = (props) => {
  const summaryCards = useAppSelector(state => state.dashboardState.summaryOverview);
  const recentTransactions = useAppSelector(state => state.dashboardState.recentTransactions);
  const categoryOverview = useAppSelector(state => state.dashboardState.categoryOverview);

  useEffect(() => {
    const controller = new DashboardController()
    controller.retrieveSummaryOverview();
    controller.retrieveRecentTransactions();
    controller.retrieveCategoryOverview();
  }, []);

  return <DashboardView
    children={props.children}
    summaryOverview={summaryCards}
    recentTransactions={recentTransactions}
    categoryOverview={categoryOverview}
  />
}