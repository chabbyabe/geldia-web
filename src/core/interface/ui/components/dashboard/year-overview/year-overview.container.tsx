import { useAppSelector } from "@base/core/interface/presenters/store/hooks";
import React from "react";
import YearOverviewView from "@interface/ui/components/dashboard/year-overview/year-overview.view";
import YearOverviewController from "@interface/ui/components/dashboard/year-overview/year-overview.controller";

interface IYearOverviewContainer {
  children?: React.ReactNode
}

export const YearOverviewContainer: React.FC<IYearOverviewContainer> = (props) => {
  const controller = new YearOverviewController()
  const yearOverview = useAppSelector( state => state.dashboardState.yearOverview );

  return <YearOverviewView
    data={yearOverview}
    onFilterChange={controller.retrieveYearOverview.bind(controller)}
  />;
};