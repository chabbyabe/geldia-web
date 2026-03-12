import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";

interface IDashboardState {
  summaryOverview: ISummary[]
  recentTransactions: ITransaction[]
}

const initialState: IDashboardState = {
  summaryOverview: [],
  recentTransactions: []
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
  },
})

export const {
  setSummaryOverview,
  setRecentTransactions
} = dashboardSlice.actions
export default dashboardSlice.reducer