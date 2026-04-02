import React, { useEffect, useMemo } from "react";
import TabTableView, { ITab } from "./tab-table.view";
import TabTableController from "./tab-table.controller";
import { useAppSelector } from "@interface/presenters/store/hooks";
import { toast } from 'react-toastify';
import { FormRequestError } from "@domain/entities/formModels/errors.entity";

interface ITabTableContainer {
  children?: React.ReactNode
  tabs: ITab[]
  selectedYear: string
  compareYear: string | null
}

const getErrorMessage = (error: FormRequestError<unknown>) => {
  const errorData = error.data as Record<string, unknown> | null
  const nonFieldErrors = errorData?.nonFieldErrors

  if (Array.isArray(nonFieldErrors) && nonFieldErrors.length) {
    return String(nonFieldErrors[0])
  }

  const firstFieldError = errorData
    ? Object.values(errorData).find((value) => Array.isArray(value) && value.length)
    : null

  if (Array.isArray(firstFieldError) && firstFieldError.length) {
    return String(firstFieldError[0])
  }

  return null
}

export const TabsContainer: React.FC<ITabTableContainer> = (props) => {
  const controller = useMemo(() => new TabTableController(), [])
  const incomeReport = useAppSelector(state => state.reportState.incomeReport);
  const expenseReport = useAppSelector(state => state.reportState.expenseReport);

  useEffect(() => {
    const retrieveReports = async () => {
      try {
        await controller.retrieveIncomeReport({
          selectedYear: props.selectedYear,
          compareYear: props.compareYear
        })
      } catch (error) {
        if (error instanceof FormRequestError) {
          toast.error(getErrorMessage(error) ?? "Unable to retrieve income report.")
        } else {
          throw error
        }
      }

      try {
        await controller.retrieveExpenseReport({
          selectedYear: props.selectedYear,
          compareYear: props.compareYear
        })
      } catch (error) {
        if (error instanceof FormRequestError) {
          toast.error(getErrorMessage(error) ?? "Unable to retrieve expenses report.")
        } else {
          throw error
        }
      }
    }

    retrieveReports()
  }, [controller, props.compareYear, props.selectedYear])

  return <TabTableView
    tabs={props.tabs}
    incomeReport={incomeReport}
    expenseReport={expenseReport}
    selectedYear={props.selectedYear ?? ''}
    compareYear={props.compareYear ?? null}
    handleSetReportTab={controller.setReportTab.bind(controller)}
  />;
};
