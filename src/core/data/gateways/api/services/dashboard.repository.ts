import { ITransaction } from "@domain/entities/transaction/transaction.entity"
import { ISummary } from "@domain/entities/dashboard/summary-overview.entity"
import { 
  setSummaryOverview, setRecentTransactions, setCategoryOverview 
} from "@interface/presenters/store/reducers/dashboard.reducer"
import { store } from "@interface/presenters/store/store"
import { ICategoryOverview } from "@domain/entities/dashboard/category-overview.entity"
import { ICategoryOverviewFilterParams } from "@domain/entities/dashboard/filter.entity"

export default class DashboardRepository {
  retrieveSummaryOverview(summaries: ISummary[]) {
    store.dispatch(setSummaryOverview(summaries))
  }
  retrieveRecentTransactions(transactions: ITransaction[]) {
    store.dispatch(setRecentTransactions(transactions))
  }
  retrieveCategoryOverview(categories: ICategoryOverview[], params: ICategoryOverviewFilterParams) {
    store.dispatch(setCategoryOverview({categories, params}))
  }
}