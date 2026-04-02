import React from "react";
import { IIncomeReport } from "@domain/entities/report/income-report.entity";
import IncomeReportView from "./income-report.view";
interface IIncomeReportContainer {
  children?: React.ReactNode
  incomeReport: IIncomeReport | null
  selectedYear: string
  compareYear: string | null
}

export const IncomeReportContainer: React.FC<IIncomeReportContainer> = (props) => {
  return <IncomeReportView
    children={props.children}
    selectedYear={props.selectedYear}
    compareYear={props.compareYear}
    incomeReport={props.incomeReport}
  />;
};
