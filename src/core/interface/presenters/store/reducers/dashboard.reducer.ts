import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import { ICategoryOverview } from "@domain/entities/dashboard/category-overview.entity";
import { ICategoryOverviewFilterParams } from "@domain/entities/dashboard/filter.entity";
import { DATE_RANGES } from "@data/gateways/api/constants";
import { IYearOverview } from "@domain/entities/dashboard/year-overview.entity";

interface IDashboardState {
  summaryOverview: ISummary[]
  recentTransactions: ITransaction[]
  categoryOverview: ICategoryOverview[],
  yearOverview: IYearOverview[],
  filters: {
    categoryOverview: ICategoryOverviewFilterParams
  }
}

const initialState: IDashboardState = {
  summaryOverview: [],
  recentTransactions: [],
  categoryOverview: [],
  yearOverview: [],
  filters: {
    categoryOverview: {
      filterBy: DATE_RANGES.MONTH,
      startDate: null,
      endDate: null
    }
  }
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSummaryOverview(state, action: PayloadAction<ISummary[]>) {
      state.summaryOverview = [...action.payload]
    },
    setRecentTransactions(state, action: PayloadAction<ITransaction[]>) {
      state.recentTransactions = [...action.payload]
    },
    setCategoryOverview(state, action: PayloadAction<{
      categories: ICategoryOverview[],
      params: ICategoryOverviewFilterParams
    }>
    ) {
      if (!state.filters) state.filters = {} as IDashboardState['filters']
      state.filters.categoryOverview = {
        filterBy: action.payload.params.filterBy,
        startDate: action.payload.params.startDate,
        endDate: action.payload.params.endDate
      }
      state.categoryOverview = [...action.payload.categories]
    },
    setYearOverview(state, action: PayloadAction<IYearOverview[]>) {
      state.yearOverview = [...action.payload]
    },
  },
})

export const {
  setSummaryOverview,
  setRecentTransactions,
  setCategoryOverview,
  setYearOverview
} = dashboardSlice.actions
export default dashboardSlice.reducer