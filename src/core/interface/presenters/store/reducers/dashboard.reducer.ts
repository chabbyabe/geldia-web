import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import { ICategoryOverview } from "@base/core/domain/entities/dashboard/category-overview.entity";

interface IDashboardState {
  summaryOverview: ISummary[]
  recentTransactions: ITransaction[]
  categoryOverview: ICategoryOverview[]
}

const initialState: IDashboardState = {
  summaryOverview: [],
  recentTransactions: [],
  categoryOverview: []
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
    setCategoryOverview(state, action: PayloadAction<ICategoryOverview[]>) {
      state.categoryOverview = [...action.payload]
    },
  },
})

export const {
  setSummaryOverview,
  setRecentTransactions,
  setCategoryOverview
} = dashboardSlice.actions
export default dashboardSlice.reducer