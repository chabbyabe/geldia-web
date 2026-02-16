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