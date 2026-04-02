import { objectToCamel } from 'ts-case-convert';
import { IExpenseReportDataModel, IIncomeReportModel } from '@data/gateways/api/api.types';
import ExpenseReportEntity, { IExpenseReportData } from '@domain/entities/report/expense-report.entity';
import { IIncomeReport } from '@domain/entities/report/income-report.entity';

export const mapIncomeReportAttributes = (initialModel: IIncomeReportModel): IIncomeReport => {
  return {
    selectedYear: initialModel.selected_year,
    compareYear: initialModel.compare_year,
    baseData: objectToCamel(initialModel.base_data) as IIncomeReport['baseData'],
    compareData: initialModel.compare_data && objectToCamel(initialModel.compare_data) as IIncomeReport['compareData'] | null,
  };
};

export const mapExpenseReportAttributes = (initialModel: IExpenseReportDataModel): IExpenseReportData => {
  const data = new ExpenseReportEntity({
    selectedYear: String(initialModel.selected_year),
    compareYear: initialModel.compare_year !== null ? String(initialModel.compare_year) : null,
    baseData: initialModel.base_data.map((model) => ({
      month: model.month,
      date: model.date,
      categories: model.categories ?? {},
      total: model.total
    })),
    compareData: initialModel.compare_data
      ? initialModel.compare_data.map((model) => ({
          month: model.month,
          date: model.date,
          categories: model.categories ?? {},
          total: model.total
        }))
      : null,
  })

  return data.getCurrentValuesAsJSON()
}
