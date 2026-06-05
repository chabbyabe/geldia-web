import { objectToCamel } from 'ts-case-convert';
import {
  IExpenseReportCategoryModel,
  IExpenseReportDataModel,
  IExpenseReportMonthDataModel,
  IIncomeReportModel
} from '@data/gateways/api/api.types';
import ExpenseReportEntity, {
  IExpenseReportCategory,
  IExpenseReportData,
  IExpenseReportMonthData,
  IExpenseReportParentCategory
} from '@domain/entities/report/expense-report.entity';
import { IIncomeReport } from '@domain/entities/report/income-report.entity';

export const mapIncomeReportAttributes = (initialModel: IIncomeReportModel): IIncomeReport => {
  return {
    selectedYear: initialModel.selected_year,
    compareYear: initialModel.compare_year,
    baseData: objectToCamel(initialModel.base_data) as IIncomeReport['baseData'],
    compareData: initialModel.compare_data && objectToCamel(initialModel.compare_data) as IIncomeReport['compareData'] | null,
  };
};

const mapExpenseReportCategory = (
  categoryName: string,
  value: string | number | IExpenseReportCategoryModel
): IExpenseReportCategory => {
  if (typeof value === 'object' && value !== null) {
    return {
      name: value.name ?? categoryName,
      color: value.color ?? null,
      amount: Number(value.amount ?? 0)
    }
  }

  return {
    name: categoryName,
    color: null,
    amount: Number(value ?? 0)
  }
}

const mapExpenseReportParentCategories = (
  parentCategories: IExpenseReportMonthDataModel['parent_categories']
): Record<string, IExpenseReportParentCategory> => {
  return Object.fromEntries(
    Object.entries(parentCategories ?? {}).map(([parentCategory, categoryData]) => [
      parentCategory,
      {
        categories: Object.fromEntries(
          Object.entries(categoryData.categories ?? {}).map(([categoryName, value]) => [
            categoryName,
            mapExpenseReportCategory(categoryName, value)
          ])
        ),
        total: Number(categoryData.total ?? 0)
      }
    ])
  )
}

const mapExpenseReportMonth = (model: IExpenseReportMonthDataModel): IExpenseReportMonthData => ({
  month: model.month,
  date: model.date,
  parentCategories: mapExpenseReportParentCategories(model.parent_categories),
  total: Number(model.total ?? 0)
})

export const mapExpenseReportAttributes = (initialModel: IExpenseReportDataModel): IExpenseReportData => {
  const data = new ExpenseReportEntity({
    selectedYear: String(initialModel.selected_year),
    compareYear: initialModel.compare_year !== null ? String(initialModel.compare_year) : null,
    baseData: initialModel.base_data.map(mapExpenseReportMonth),
    compareData: initialModel.compare_data
      ? initialModel.compare_data.map(mapExpenseReportMonth)
      : null,
  })

  return data.getCurrentValuesAsJSON()
}
