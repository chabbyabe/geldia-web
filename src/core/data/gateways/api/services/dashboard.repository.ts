import { ITransaction } from "@domain/entities/transaction/transaction.entity"
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity"
import { setSummaryOverview, setRecentTransactions } from "@interface/presenters/store/reducers/dashboard.reducer"
import { store } from "@interface/presenters/store/store"

export default class DashboardRepository {
  retrieveSummaryOverview(summaries: ISummary[]) {
    store.dispatch(setSummaryOverview(summaries))
  }
  retrieveRecentTransactions(transactions: ITransaction[]) {
    store.dispatch(setRecentTransactions(transactions))
  }
}