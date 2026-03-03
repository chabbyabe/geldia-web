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

export interface IUserModel extends IBaseAPIModel {
  name: string
  username: string
  first_name: string
  last_name: string
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
  notes: string,
  user: IUserModel,
  shared_users: IUserModel[],
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
}

export interface IStoreSimpleModel extends IBaseAPIModel {
  name: string
}

export interface IPlaceSimpleModel extends IBaseAPIModel{
  name: string
}

export interface ITagSimpleModel extends IBaseAPIModel{
  name: string
  color: string
}

export interface ICategorySimpleModel extends IBaseAPIModel, ITransactionTypeModel{
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
  formatted_amount: string
  formatted_net_amount: string
  formatted_gross_amount: string
  debit_month_year: string
  external_transaction_id: number
  pair_transaction: IAccountSimpleModel
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