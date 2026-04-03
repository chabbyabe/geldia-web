import { IExpenseReportData } from "@domain/entities/report/expense-report.entity";
import { IIncomeReport } from "@domain/entities/report/income-report.entity";
import { Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import { IncomeReportContainer } from "../income-report/income-report.container";
import { ExpensesReportContainer } from "../expenses-report/expenses-report";
import { useAppSelector } from "@interface/presenters/store/hooks";

export interface ITab {
  id: number
  label: string
}

export interface ITabTableView {
  children?: React.ReactNode
  tabs: ITab[]
  incomeReport: IIncomeReport | null
  expenseReport: IExpenseReportData | null
  selectedYear: string
  compareYear: string | null
  handleSetReportTab: (reportTab: number) => void
}


const TabTableView: React.FC<ITabTableView> = (props) => {
  const reportTab = useAppSelector(state => state.reportState.reportTab);
  const [tab, setTab] = React.useState(reportTab);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    props.handleSetReportTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange} sx={{ mt: 2 }}>
        {props.tabs.map((tabItem, index) => (
          <Tab key={tabItem.id} label={tabItem.label} value={index} />
        ))}
      </Tabs>

      <Paper sx={{ mt: 2, p: 2 }}>
        {tab === 0 && <IncomeReportContainer incomeReport={props.incomeReport} selectedYear={props.selectedYear} compareYear={props.compareYear} />}
        {tab === 1 && <ExpensesReportContainer expensesReport={props.expenseReport} selectedYear={props.selectedYear} compareYear={props.compareYear} />}
      </Paper>
    </>
  );
};

export default TabTableView;
