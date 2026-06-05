import { useAppSelector } from "@base/core/interface/presenters/store/hooks";
import React, { useEffect, useMemo } from "react";
import YearOverviewView from "@interface/ui/components/dashboard/year-overview/year-overview.view";
import YearOverviewController from "@interface/ui/components/dashboard/year-overview/year-overview.controller";

interface IYearOverviewContainer {
  children?: React.ReactNode
  refreshKey?: number
}

export const YearOverviewContainer: React.FC<IYearOverviewContainer> = (props) => {
  const yearOverview = useAppSelector( state => state.dashboardState.yearOverview );
  const yearOverviewFilterParams = useAppSelector( state => state.dashboardState.filters?.yearOverview ?? { 'year' : new Date().getFullYear()} );

    
  const controller = useMemo(() => new YearOverviewController(), []);

  useEffect(() => {
    controller.retrieveYearOverview(yearOverviewFilterParams);
  }, [props.refreshKey]);


  return <YearOverviewView
    data={yearOverview}
    onFilterChange={controller.retrieveYearOverview.bind(controller)}
    filterParams={yearOverviewFilterParams}
  />;
};