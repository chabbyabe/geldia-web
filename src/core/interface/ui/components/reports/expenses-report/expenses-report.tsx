import React from "react";
import ExpensesReportView from "./expenses-report.view";
import { IExpenseReportData } from "@domain/entities/report/expense-report.entity";
interface IExpensesReportContainer {
  children?: React.ReactNode
  expensesReport: IExpenseReportData | null
  selectedYear: string
  compareYear: string | null
}

export const ExpensesReportContainer: React.FC<IExpensesReportContainer> = (props) => {
  return <ExpensesReportView
    children={props.children}
    selectedYear={props.selectedYear}
    compareYear={props.compareYear}
    expensesReport={props.expensesReport}
  />;
};
