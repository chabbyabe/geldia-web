import React, { useEffect, useMemo } from "react";
import CategoryOverviewView from "./category-overview.view";
import { useAppSelector } from "@interface/presenters/store/hooks";
import CategoryOverviewController from "./category-overview.controller";

interface ICategoryOverviewContainer {
  children?: React.ReactNode;
  refreshKey?: number
}

export const CategoryOverviewContainer: React.FC<ICategoryOverviewContainer> = (props) => {
  const { categoryOverview, categoryOverviewFilterParams } = useAppSelector(
    state => ({
      categoryOverview: state.dashboardState.categoryOverview,
      categoryOverviewFilterParams: state.dashboardState.filters?.categoryOverview
    })
  );
  
  const controller = useMemo(() => new CategoryOverviewController(), []);

  useEffect(() => {
    controller.retrieveCategoryOverview(categoryOverviewFilterParams);
  }, [props.refreshKey]);

  return <CategoryOverviewView
    data={categoryOverview}
    onFilterChange={controller.retrieveCategoryOverview.bind(controller)}
    filterParams={categoryOverviewFilterParams}
  />;
};