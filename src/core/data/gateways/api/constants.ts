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
export const DASHBOARD_URL = `/ledger/dashboard/`

/**
 * PAGINATION CONSTANTS
 */
export const DEFAULT_TABLE_PAGE_SIZE = 20


export const TRANSACTION_TYPE = {
  INCOME: {
    id: 1, // API id
    name: "Income"
  },
  EXPENSES: {
    id: 2,
    name: "Expenses"
  },
  TRANSFER: {
    id: 3,
    name: "Transfer"
  }
}

export const USER_ACTIONS = {
  CREATE: {
    id: 1,
    name: "Create"
  },
  UPDATE: {
    id: 2,
    name: "Update"
  },
  DELETE: {
    id: 3,
    name: "Delete"
  }
}

export const DATE_RANGES = {
  WEEK : "Week",
  MONTH : "Month",
  YEAR : "Year",
  CUSTOM : "Custom"
}
