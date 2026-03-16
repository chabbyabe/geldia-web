import React from "react";
import DateFilterView from "./date-filter.view";

export interface IDateFilterContainer<T = any, P = any> {
  children?: React.ReactNode
  onFilterChange: (params: T ) => void
  filterParams: P
}

export const DateFilterContainer: React.FC<IDateFilterContainer> = (props) => {
  return <DateFilterView
    children={props.children}
    filterParams={props.filterParams}
    onFilterChange={props.onFilterChange}
  />;
};