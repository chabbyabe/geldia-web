/**
 * Contains all the interfaces for the API responses
 */
export interface IBaseAPIModel {
  id: number
}

export interface ITimestampsModel {
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface ApiDataResponseModel<T> {
  success: boolean
  code: number
  error: string | null
  response?: T
}

export interface IPagedAPIViewModel<T> {
  previous: string | null
  next: string | null
  count: number
  current_page_number: number
  total_pages: number
  results: T[]
}

export interface IErrorResponseModel {
  detail?: string
  error?: string
  data?: any
}

export interface IMessageResponseModel {
  detail: string
}

export interface ICompanyModel extends IBaseAPIModel, ITimestampsModel {
  name: string
  is_current: boolean | false
  joined_at: string | null
  resigned_at: string | null
  created_by: IUserModel | null
  updated_by: IUserModel | null
  deleted_by: IUserModel | null
}

export interface IUserModel extends IBaseAPIModel {
  name: string
  username: string
  email: string
  email_verified?: boolean
  first_name: string
  last_name: string
  company?: ICompanyModel | null
}

export interface IUserWithAccessTokenModel extends IBaseAPIModel {
  access: string
  refresh: string
  user: IUserModel
}

export interface ILogoutResponseModel {
  detail: string
}

export interface IAccountModel extends IBaseAPIModel, ITimestampsModel {
  name: string
  icon: string | null,
  color: string | null,
  balance: number,
  count_in_assets: boolean,
  is_default: boolean,
  is_shared: boolean,
  is_savings: boolean,
  notes: string,
  user: IUserModel,
  shared_users: IUserModel[],
  categories: ICategoryModel[],
  has_transactions: boolean
}

export interface ITransactionTypeModel extends IBaseAPIModel {
  name: string
  icon: string
  color: string
}

export interface IAccountSimpleModel extends ITransactionTypeModel {
  balance: number
  is_default: boolean
  user_id: number
  categories: ICategorySimpleModel[] | []
}

export interface IStoreSimpleModel extends IBaseAPIModel {
  name: string
}

export interface IPlaceSimpleModel extends IBaseAPIModel {
  name: string
}

export interface IStoreModel extends IBaseAPIModel, ITimestampsModel {
  created_by: IUserModel | null
  updated_by: IUserModel | null
  deleted_by: IUserModel | null
  name: string
}

export interface IPlaceModel extends IBaseAPIModel, ITimestampsModel {
  created_by: IUserModel | null
  updated_by: IUserModel | null
  deleted_by: IUserModel | null
  name: string
}

export interface ITagSimpleModel extends IBaseAPIModel {
  name: string
  color: string
}

export interface ITagModel extends IBaseAPIModel, ITimestampsModel {
  created_by: IUserModel | null
  updated_by: IUserModel | null
  deleted_by: IUserModel | null
  name: string
  color: string | null
}

export interface ICategorySimpleModel extends IBaseAPIModel, ITransactionTypeModel {
  transaction_type: ITransactionTypeModel | null
  parent_category: ICategorySimpleModel | null
}

export interface ICategoryModel extends IBaseAPIModel, ITimestampsModel {
  created_by: IUserModel | null
  updated_by: IUserModel | null
  deleted_by: IUserModel | null
  transaction_type: ITransactionTypeModel | null
  parent_category: ICategorySimpleModel | null
  name: string
  notes: string | null
  color: string | null
  icon: string | null
  children: ICategoryListItemModel[]
}

export interface ICategoryListItemModel extends IBaseAPIModel {
  name: string
  color: string | null
  icon: string | null
  notes: string | null
  transaction_type: ITransactionTypeModel | null
  parent_category: ICategorySimpleModel | null
}

export interface ITransactionModel extends IBaseAPIModel, ITimestampsModel {
  name: string
  user: IUserModel
  store: IStoreSimpleModel
  place: IPlaceSimpleModel
  account: IAccountSimpleModel
  tags: ITagSimpleModel[]
  transaction_type: ITransactionTypeModel
  amount: number
  notes: string
  net_amount: number
  gross_amount: number
  debit_month_year: string
  external_transaction_id: number
  pair_account: IAccountSimpleModel
  is_recurring: boolean
  is_refunded: boolean
  refunded_at: string
  transaction_at: string
  category: ICategorySimpleModel
  recurring: boolean
}

export interface ITransactionFormInitialDataModel {
  stores: IStoreSimpleModel[]
  places: IPlaceSimpleModel[]
  accounts: IAccountSimpleModel[]
  categories: ICategorySimpleModel[]
  transaction_types: ITransactionTypeModel[]
  tags: ITagSimpleModel[]
}

export interface ITransactionImportResultModel {
  created_count: number
  skipped_count: number
  created_ids: number[]
}

export interface ISummaryModel {
  name: string
  icon: string
  color: string
  amount: number
}

export interface ICategoryOverviewModel {
  name: string
  icon: string
  color: string
  is_parent: boolean
  amount: number
}

export interface IYearOverviewModel {
  name: string
  label: string[]
  data: number[]
  year: string
}

export interface IIncomeReportCompanyModel {
  name: string
  gross_amount: number
  net_amount: number
}

export interface IIncomeReportDataModel {
  month: number
  month_label: string
  gross_amount: number
  net_amount: number
  companies: IIncomeReportCompanyModel[]
}

export interface IIncomeReportModel {
  selected_year: string
  compare_year: string | null
  base_data: IIncomeReportDataModel[]
  compare_data: IIncomeReportDataModel[] | null
}

export interface IExpenseReportCategoryModel {
  name: string
  color: string | null
  amount: string | number
}

export interface IExpenseReportParentCategoryModel {
  categories: Record<string, string | number | IExpenseReportCategoryModel>
  total: string | number
}

export interface IExpenseReportMonthDataModel {
  month: number
  date: string
  parent_categories: Record<string, IExpenseReportParentCategoryModel>
  total: string | number
}

export interface IExpenseReportDataModel {
  selected_year: string | number
  compare_year: string | number | null
  base_data: IExpenseReportMonthDataModel[]
  compare_data: IExpenseReportMonthDataModel[] | null
}

export interface ILogUserModel extends IBaseAPIModel {
  first_name: string
  last_name: string
  username: string
}

export interface ILogReferenceModel extends IBaseAPIModel {
  name: string
}

export interface ILogTagModel extends ILogReferenceModel {
  color: string | null
}

export interface ILogAccountModel extends IBaseAPIModel {
  name: string
  icon: string | null
  color: string | null
  balance: string
  is_default: boolean
  user_id?: number
}

export interface ILogAccountReferenceModel extends ILogAccountModel {
  categories: ICategorySimpleModel[]
}

export interface ILogTransactionTypeModel extends IBaseAPIModel {
  name: string
  icon: string
  color: string
}

export interface ILogCategoryModel extends ILogReferenceModel {
  color: string | null
  icon: string | null
  transaction_type: ILogTransactionTypeModel | null
  parent_category: ILogReferenceModel | null
}

export interface ILogTransactionDataModel extends IBaseAPIModel {
  user: ILogUserModel | null
  store: ILogReferenceModel | null
  category: ILogCategoryModel | null
  place: ILogReferenceModel | null
  account: ILogAccountModel | null
  pair_account: unknown | null
  transaction_type: ILogTransactionTypeModel | null
  tags: ILogTagModel[]
  updated_at: string
  created_at: string
  deleted_at: string | null
  amount: string | null
  name: string
  notes: string
  net_amount: string | null
  gross_amount: string | null
  debit_month_year: string | null
  external_transaction_id: string | null
  is_recurring: boolean
  is_refunded: boolean
  refunded_at: string | null
  transaction_at: string
  previous_balance: string | null
  pair_previous_balance: string | null
  created_by: number | null
  updated_by: number | null
  deleted_by: number | null
  recurring: unknown | null
}

export interface ITransactionLogModel extends IBaseAPIModel {
  performed_by: ILogUserModel
  transaction: ILogTransactionDataModel | null
  action: "create" | "updated" | "deleted"
  old_data: ILogTransactionDataModel | null
  new_data: ILogTransactionDataModel | null
  notes: string | null
  created_at: string
}

export interface IAccountLogSnapshotModel extends IBaseAPIModel {
  icon: string | null
  name: string
  color: string | null
  notes: string | null
  balance: string
  user_id: number
  is_shared: boolean
  is_default: boolean
  is_savings: boolean
  category_ids: number[]
  count_in_assets: boolean
  shared_user_ids: number[]
}

export interface IAccountLogModel extends IBaseAPIModel {
  account: ILogAccountReferenceModel | null
  action: "create" | "updated" | "deleted"
  performed_by: ILogUserModel | null
  old_data: IAccountLogSnapshotModel | null
  new_data: IAccountLogSnapshotModel | null
  note: string | null
  created_at: string
}
