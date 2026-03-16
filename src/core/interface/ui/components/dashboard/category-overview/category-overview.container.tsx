import React from "react";
import { ICategoryOverview } from "@domain/entities/dashboard/category-overview.entity";
import CategoryOverviewView from "./category-overview.view";

interface ICategoryOverviewContainer {
  data: ICategoryOverview[];
}

export const CategoryOverviewContainer: React.FC<ICategoryOverviewContainer> = (props) => {
  return <CategoryOverviewView
    data={props.data}
  />;
};