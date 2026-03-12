import { ISummary } from "@domain/entities/dashboard/summary-overview.entity"
import { retrieveSummaryOverview } from "@interface/presenters/store/reducers/dashboard.reducer"
import { store } from "@interface/presenters/store/store"

export default class DashboardRepository {
  retrieveSummaryOverview(summaries: ISummary[]) {
    store.dispatch(retrieveSummaryOverview(summaries))
  }
}