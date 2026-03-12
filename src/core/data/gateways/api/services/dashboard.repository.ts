import { ISummary } from "@domain/entities/dashboard/summary-overview.entity"
import { setSummaryOverview } from "@interface/presenters/store/reducers/dashboard.reducer"
import { store } from "@interface/presenters/store/store"

export default class DashboardRepository {
  retrieveSummaryOverview(summaries: ISummary[]) {
    store.dispatch(setSummaryOverview(summaries))
  }
}