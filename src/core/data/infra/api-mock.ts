import MockAdapter from 'axios-mock-adapter'
import {
  ACCOUNT_URL,
  API_URL,
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
  TRANSACTION_TYPE,
  TRANSACTION_URL,
} from '@data/gateways/api/constants'
import { IFormLogin, IFormSignUp } from '@domain/entities/formModels/signup-form.entity'
import { IYearOverviewFilterParams } from '@domain/entities/dashboard/filter.entity'
import { escapeRegExpForApiRequest, getIdFromUrl } from '@base/core/data/utils/regex.utils'
import { IFormAccount } from '@base/core/domain/entities/formModels/account-form.entity'
import { IFormTransaction } from '@domain/entities/formModels/transaction-form.entity'
import { ITransaction } from '@base/core/domain/entities/transaction/transaction.entity'
import { ICategoryOverview } from '@base/core/domain/entities/dashboard/category-overview.entity'

const MOCK_URLS = {
  REGISTER: REGISTER_URL,
  LOGIN: LOGIN_URL,
  LOGOUT: LOGOUT_URL,
  DASHBOARD: {
    SUMMARY_OVERVIEW: API_URL.DASHBOARD.summaryOverview,
    RECENT_TRANSACTIONS: API_URL.DASHBOARD.recentTransactions,
    CATEGORY_OVERVIEW: new RegExp(`^${escapeRegExpForApiRequest(API_URL.DASHBOARD.categoryOverview)}\\?.*$`),
    YEAR_OVERVIEW: new RegExp(`^${escapeRegExpForApiRequest(API_URL.DASHBOARD.yearOverview)}\\?.*$`),
  },
  ACCOUNT: {
    BASE: ACCOUNT_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(ACCOUNT_URL)}\\d+/$`),
  },
  TRANSACTION: {
    FORM_INITIAL: `${TRANSACTION_URL}initial/list/`,
    BASE: TRANSACTION_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(TRANSACTION_URL)}\\d+/$`),
  },
}

export const mockAPIResponses = (
  axiosInstance: any, testError: boolean = false, baseDataRes: any = {}, pk: number | null = null
): void => {
  const mock = new MockAdapter(axiosInstance)

  if (testError) {
    // User Registration
    mock.onPost(MOCK_URLS.REGISTER).reply(400, getUserRegistrationErrorResponse(baseDataRes))
    // Login
    mock.onPost(MOCK_URLS.LOGIN).reply(400, getUserLoginErrorResponse(baseDataRes))
    // Dashboard
    mock.onGet(MOCK_URLS.DASHBOARD.SUMMARY_OVERVIEW).reply(400, getDashboardErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.DASHBOARD.RECENT_TRANSACTIONS).reply(400, getDashboardErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.DASHBOARD.YEAR_OVERVIEW).reply(400, getDashboardYearOverviewErrorResponse(baseDataRes))
    // Accounts
    mock.onGet(MOCK_URLS.ACCOUNT.BASE).reply(400, getAccountErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.ACCOUNT.DETAIL).reply(400, getAccountErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.ACCOUNT.BASE).reply(400, getAccountErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.ACCOUNT.DETAIL).reply(400, getAccountErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.ACCOUNT.DETAIL).reply(400, getAccountErrorResponse(baseDataRes))
    // Transactions
    mock.onGet(MOCK_URLS.TRANSACTION.FORM_INITIAL).reply(400, getTransactionErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TRANSACTION.BASE).reply(400, getTransactionErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TRANSACTION.DETAIL).reply(400, getTransactionErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.TRANSACTION.BASE).reply(400, getTransactionErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.TRANSACTION.DETAIL).reply(400, getTransactionErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.TRANSACTION.DETAIL).reply(400, getTransactionErrorResponse(baseDataRes))
  } else {
    // User Registration
    mock.onPost(MOCK_URLS.REGISTER).reply(201, formatUserCreateIntoResponse(baseDataRes))
    // Login
    mock.onPost(MOCK_URLS.LOGIN).reply(200, formatUserLoginIntoResponse(baseDataRes))
    // Logout
    mock.onPost(MOCK_URLS.LOGOUT).reply(200, formatUserLogoutIntoResponse())
    // Dashboard
    mock.onGet(MOCK_URLS.DASHBOARD.SUMMARY_OVERVIEW).reply(200, formatDashboardSummaryOverviewIntoResponse())
    mock.onGet(MOCK_URLS.DASHBOARD.RECENT_TRANSACTIONS).reply(200, formatDashboardRecentTransactionsIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.DASHBOARD.CATEGORY_OVERVIEW).reply(200, formatDashboardCategoryOverviewIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.DASHBOARD.YEAR_OVERVIEW).reply(200, formatDashboardYearOverviewIntoResponse(baseDataRes))
    // Accounts
    mock.onGet(MOCK_URLS.ACCOUNT.BASE).reply(200, formatRetrieveAccountsIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.ACCOUNT.DETAIL).reply((config) => {
      return [200, formatAccountIntoResponse(baseDataRes.accountForm, getIdFromUrl(config.url))]
    })
    mock.onPost(ACCOUNT_URL).reply(201, formatAccountIntoResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.ACCOUNT.DETAIL).reply((config) => {
      return [200, formatAccountIntoResponse(baseDataRes.accountForm, getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.ACCOUNT.DETAIL).reply(204)
    // Transactions
    mock.onGet(MOCK_URLS.TRANSACTION.FORM_INITIAL).reply(200, formatTransactionInitialDataIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TRANSACTION.BASE).reply(200, formatRetrieveTransactionsIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TRANSACTION.DETAIL).reply((config) => {
      return [200, formatTransactionIntoResponse(baseDataRes, getIdFromUrl(config.url))]
    })
    mock.onPost(MOCK_URLS.TRANSACTION.BASE).reply(201, formatTransactionIntoResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.TRANSACTION.DETAIL).reply((config) => {
      return [200, formatTransactionIntoResponse(baseDataRes, getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.TRANSACTION.DETAIL).reply(204)
  }
}

/** Logout */
const formatUserLogoutIntoResponse = () => {
  return {
    "detail": 'Successfully logged out.',
  }
}

/** Login */
const getUserLoginErrorResponse = (data: string) => {
  return {
    "non_form_errors": [data]
  }
}


const formatUserLoginIntoResponse = (data: IFormLogin) => {
  return {
    "access": "xxx",
    "refresh": "yyy",
    "user": {
      "pk": 5,
      "first_name": "John",
      "last_name": "Doe",
      "username": data.username,
    },
  }
}

/** User Registration */
const getUserRegistrationErrorResponse = (data: string) => {
  return {
    "username": [
      "This username is taken."
    ]
  }
}


const formatUserCreateIntoResponse = (data: IFormSignUp) => {
  return {
    "access": "xxx",
    "refresh": "yyy",
    "user": {
      "pk": 5,
      "first_name": data.firstName,
      "last_name": data.lastName,
      "username": data.username,
    },
  }
}

/* Dashboard */
const getDashboardErrorResponse = (data: any) => {
  return {
    "non_field_errors": [data?.errorMessage ?? data ?? 'failed'],
  }
}

const formatDashboardSummaryOverviewIntoResponse = () => {
  return [
    {
        "name": "Income",
        "icon": "Savings",
        "color": "#006CD1",
        "amount": "185489.00",
        "formatted_amount": "€185,489.00"
    },
    {
        "name": "Expenses",
        "icon": "Payments",
        "color": "#E5484D",
        "amount": "293402.00",
        "formatted_amount": "€293,402.00"
    },
    {
        "name": "Savings",
        "icon": "Balance",
        "color": "#F5A524",
        "amount": "49200.00",
        "formatted_amount": "€49,200.00"
    }
  ]
}

const formatDashboardRecentTransactionsIntoResponse = (data: any) => {
  return (data?.transactions ?? []).map((transaction: ITransaction) =>
    formatTransactionIntoResponse(transaction),
  )
}

const formatDashboardCategoryOverviewIntoResponse = (data: any) => {
  return (data?.categories ?? []).map((category: ICategoryOverview) =>
    formatCategoryOverview(category),
  )
}

const formatCategoryOverview = (category : ICategoryOverview) => {
  return category;
}
 
/** Dashboard Year Overview**/
const getDashboardYearOverviewErrorResponse = (data: string) => {
  return {
    "year": [
      "Year must be between 2023 and 2029."
    ]
  }
}

export const formatDashboardYearOverviewIntoResponse = (data: IYearOverviewFilterParams) => {
  return [
    {
      "name": "Income",
      "label": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      "data": [0, 131390.0, 57399.0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "year": data.year
    },
    {
      "name": "Expenses",
      "label": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      "data": [0, 1865.0, 114539.0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "year": data.year
    }
  ]
}

/** Accounts **/
const getAccountErrorResponse = (data: any) => {
  return {
    "non_field_errors": [data?.errorMessage ?? data ?? 'failed'],
  }
}

const formatRetrieveAccountsIntoResponse = (data: any) => {
  return {
    "previous": null,
    "next": null,
    "count": 1,
    "current_page_number": 1,
    "total_pages": 1,
    "results": [formatAccountIntoResponse(data)],
  }
}

const formatAccountIntoResponse = (
  data: any,
  accountIdOverride?: number,
) => {
  const accountId = accountIdOverride ?? data?.accountId
  const accountForm: IFormAccount = data?.accountForm ?? data

  return {
    "id": accountId,
    "name": accountForm.name,
    "icon": accountForm.icon,
    "color": accountForm.color,
    "balance": accountForm.balance ?? 0,
    "count_in_assets": accountForm.countInAssets,
    "is_default": accountForm.isDefault,
    "is_shared": accountForm.isShared,
    "notes": accountForm.notes,
    "user": accountForm.user,
    "shared_users": accountForm.sharedUsers ?? [],
    "has_transactions": false,
    "created_at": '2026-01-01T00:00:00.000Z',
    "updated_at": null,
    "deleted_at": null,
  }
}

//  Transactions
const getTransactionErrorResponse = (data: any) => {
  return {
    "non_field_errors": [data?.errorMessage ?? data ?? 'failed'],
  }
}

const formatTransactionInitialDataIntoResponse = (data: any) => {
  return {
    "stores": data.stores,
    "places": data.places,
    "accounts": data.accounts,
    "categories": data.categories,
    "transaction_types": data.transactionTypes,
    "tags": data.tags,
  }
}

const formatRetrieveTransactionsIntoResponse = (data: any) => {
  return {
    "previous": null,
    "next": null,
    "count": 1,
    "current_page_number": 1,
    "total_pages": 1,
    "results": [formatTransactionIntoResponse(data)],
  }
}

const formatTransactionIntoResponse = (data: any, transactionIdOverride?: number) => {
  const transactionId = transactionIdOverride ?? data?.transactionId
  const transactionForm: IFormTransaction = data?.transactionForm ?? data
  const transactionTypeName =
    transactionForm.transactionType === TRANSACTION_TYPE.INCOME.id
      ? TRANSACTION_TYPE.INCOME.name
      : transactionForm.transactionType === TRANSACTION_TYPE.EXPENSES.id
        ? TRANSACTION_TYPE.EXPENSES.name
        : TRANSACTION_TYPE.TRANSFER.name

  return {
    "id": transactionId,
    "name": transactionForm.name,
    "user": transactionForm.user
      ? {
        "id": transactionForm.user,
        "username": 'johndoe',
        "first_name": 'John',
        "last_name": 'Doe',
      }
      : null,
    "store": transactionForm.store
      ? {
        "id": 101,
        "name": transactionForm.store,
      }
      : null,
    "place": transactionForm.place
      ? {
        "id": 102,
        "name": transactionForm.place,
      }
      : null,
    "account": transactionForm.account
      ? {
        "id": transactionForm.account,
        "name": 'Main Account',
        "balance": 5000,
        "icon": null,
        "color": '#006CD1',
        "is_default": false,
      }
      : null,
    "tags": (transactionForm.tags ?? []).map((tag, index) => ({
      "id": index + 1,
      "name": tag,
      "color": '#006CD1',
    })),
    "transaction_type": transactionForm.transactionType
      ? {
        "id": transactionForm.transactionType,
        "name": transactionTypeName,
        "icon": null,
        "color": '#006CD1',
      }
      : null,
    "amount": transactionForm.amount ?? 0,
    "notes": transactionForm.notes,
    "net_amount": transactionForm.netAmount,
    "gross_amount": transactionForm.grossAmount,
    "formatted_amount": `${transactionForm.amount ?? 0}.00`,
    "formatted_net_amount": `${transactionForm.netAmount ?? 0}.00`,
    "formatted_gross_amount": `${transactionForm.grossAmount ?? 0}.00`,
    "debit_month_year": transactionForm.debitMonthYear,
    "external_transaction_id": transactionForm.externalTransactionId,
    "pair_transaction": transactionForm.pairTransaction
      ? {
        "id": transactionForm.pairTransaction,
        "name": 'Transfer Account',
        "balance": 1000,
        "icon": null,
        "color": '#1D4ED8',
        "is_default": false,
      }
      : null,
    "is_recurring": transactionForm.isRecurring,
    "is_refunded": transactionForm.isRefunded,
    "refunded_at": transactionForm.refundedAt,
    "transaction_at": transactionForm.transactionAt,
    "category": transactionForm.category
      ? {
        "id": 301,
        "name": transactionForm.category,
        "icon": null,
        "color": '#16A34A',
        "transaction_type": {
          "id": transactionForm.transactionType,
          "name": transactionTypeName,
          "icon": null,
          "color": '#006CD1',
        },
        "parent_category": null,
      }
      : null,
    "created_at": '2026-01-01T00:00:00.000Z',
    "updated_at": null,
    "deleted_at": null,
    "recurring": transactionForm.isRecurring,
  }
}
