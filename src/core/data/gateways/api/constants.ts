/**
 * AUTH URLS
 */
export const LOGIN_URL = `/users/auth/login/`
export const LOGOUT_URL = `/users/auth/logout/`
export const REGISTER_URL = `/users/auth/register`

/**
 *  URLS
 */
export const ACCOUNT_URL = `/ledger/accounts/`
export const USER_URL = `/ledger/users/`
export const TRANSACTION_URL = `/ledger/transactions/`


/**
 * PAGINATION CONSTANTS
 */
export const DEFAULT_TABLE_PAGE_SIZE = 20


export const TRANSACTION_TYPE = {
  INCOME: 1,
  EXPENSES: 2,
  TRANSFER: 3
}

export const USER_ACTIONS = {
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3
}

export const ACCOUNT_COLORS: string[] = [
  "#006CD1",
  "#0053A3",
  "#4DA3FF",
  "#2EB872",
  "#F5A524",
  "#E5484D"
];

export const DATE_RANGES = {
  WEEK : "Week",
  MONTH : "Month",
  YEAR : "Year",
  CUSTOM : "Custom"
}
