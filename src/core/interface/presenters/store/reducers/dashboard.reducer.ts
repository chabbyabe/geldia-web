import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISummary } from "@base/core/domain/entities/dashboard/summary-overview.entity";

interface IDashboardState {
  summaryOverview: ISummary[],
}

const initialState: IDashboardState = {
  summaryOverview: [],
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    retrieveSummaryOverview(state, action: PayloadAction<ISummary[]>) {
      state.summaryOverview = [...action.payload]
    },
  },
})

export const {
  retrieveSummaryOverview,
} = dashboardSlice.actions
export default dashboardSlice.reducer