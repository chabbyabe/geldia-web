import React from "react";
import CategoryOverviewView from "./category-overview.view";
import { useAppSelector } from "@interface/presenters/store/hooks";
import CategoryOverviewController from "./category-overview.controller";

interface ICategoryOverviewContainer {
  children?: React.ReactNode;
}

export const CategoryOverviewContainer: React.FC<ICategoryOverviewContainer> = (props) => {
  const { categoryOverview, categoryOverviewFilterParams } = useAppSelector(
    state => ({
      categoryOverview: state.dashboardState.categoryOverview,
      categoryOverviewFilterParams: state.dashboardState.filters?.categoryOverview
    })
  );
  
  const controller = new CategoryOverviewController()

  return <CategoryOverviewView
    data={categoryOverview}
    onFilterChange={controller.retrieveCategoryOverview.bind(controller)}
    filterParams={categoryOverviewFilterParams}
  />;
};