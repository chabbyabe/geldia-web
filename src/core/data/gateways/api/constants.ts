/**
 * AUTH URLS
 */
export const LOGIN_URL = `/users/auth/login/`
export const LOGOUT_URL = `/users/auth/logout/`
export const REGISTER_URL = `/users/auth/register`
export const CURRENT_USER_URL = `/users/auth/user/`
export const CHANGE_PASSWORD_URL = `/users/auth/password/change/`
export const REQUEST_EMAIL_VERIFICATION_URL = `/users/auth/register/verify/`
export const CONFIRM_EMAIL_VERIFICATION_URL = `/users/auth/register/verify/confirm/`

/**
 *  URLS
 */
export const ACCOUNT_URL = `/ledger/accounts/`
export const USER_URL = `/ledger/users/`
export const TRANSACTION_URL = `/ledger/transactions/`
export const CATEGORY_URL = `/ledger/categories/`
export const TAG_URL = `/ledger/tags/`
export const STORE_URL = `/ledger/stores/`
export const PLACE_URL = `/ledger/places/`
export const DASHBOARD_URL = `/ledger/dashboard/`
export const REPORT_URL = `/ledger/reports/`
export const LOGS_TRANSACTION_URL = `/ledger/logs/transaction-logs/`
export const LOGS_ACCOUNT_URL = `/ledger/logs/account-logs/`
export const USER_SETTINGS_URL = `/users/settings/`
export const COMPANY_URL = `${USER_SETTINGS_URL}companies/`

export const API_URL = {
  DASHBOARD : {
    base : DASHBOARD_URL,
    summaryOverview : `${DASHBOARD_URL}summary-overview/`,
    recentTransactions : `${DASHBOARD_URL}recent-transactions/`,
    categoryOverview : `${DASHBOARD_URL}category-overview/`,
    yearOverview : `${DASHBOARD_URL}year-overview/`
  },
  REPORT: {
    base: REPORT_URL,
    incomeReport: `${REPORT_URL}income-report/`,
    expenseReport: `${REPORT_URL}expenses-report/`
  },
  CATEGORY: {
    base: CATEGORY_URL,
    userCategory: `${USER_SETTINGS_URL}categories/`
  },
  TAG: {
    base: TAG_URL
  },
  STORE: {
    base: STORE_URL
  },
  PLACE: {
    base: PLACE_URL
  },
  LOGS: {
    transactions: LOGS_TRANSACTION_URL,
    accounts: LOGS_ACCOUNT_URL
  }
}

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
    name: "Created"
  },
  UPDATE: {
    id: 2,
    name: "Updated"
  },
  DELETE: {
    id: 3,
    name: "Deleted"
  }
}

export const DATE_RANGES = {
  WEEK : "Week",
  MONTH : "Month",
  YEAR : "Year",
  CUSTOM : "Custom"
}
