import MockAdapter from 'axios-mock-adapter'
import {
  ACCOUNT_URL,
  API_URL,
  LOGIN_URL,
  LOGS_TRANSACTION_URL,
  LOGOUT_URL,
  REGISTER_URL,
  TRANSACTION_TYPE,
  TRANSACTION_URL,
} from '@data/gateways/api/constants'
import { IFormLogin, IFormSignUp } from '@domain/entities/formModels/signup-form.entity'
import { IYearOverviewFilterParams } from '@domain/entities/dashboard/filter.entity'
import { IReportFilterParams } from '@domain/entities/report/filter.entity'
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
  REPORT: {
    INCOME: new RegExp(`^${escapeRegExpForApiRequest(API_URL.REPORT.incomeReport)}\\?.*$`),
    EXPENSE: new RegExp(`^${escapeRegExpForApiRequest(API_URL.REPORT.expenseReport)}\\?.*$`),
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
  LOGS: {
    BASE: LOGS_TRANSACTION_URL,
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
    mock.onGet(MOCK_URLS.REPORT.INCOME).reply(400, getDashboardErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.REPORT.EXPENSE).reply(400, getDashboardErrorResponse(baseDataRes))
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
    mock.onGet(MOCK_URLS.LOGS.BASE).reply(400, getTransactionErrorResponse(baseDataRes))
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
    mock.onGet(MOCK_URLS.REPORT.INCOME).reply(200, formatIncomeReportIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.REPORT.EXPENSE).reply(200, formatExpenseReportIntoResponse())
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
    mock.onGet(MOCK_URLS.LOGS.BASE).reply(200, formatRetrieveLogsIntoResponse())
  }
}

const formatRetrieveLogsIntoResponse = () => {
  return {
    count: 4,
    total_pages: 1,
    current_page_number: 1,
    next: null,
    previous: null,
    results: [
      {
        id: 329,
        performed_by: {
          id: 28,
          first_name: "abedee",
          last_name: "abebe",
          username: "abedeee"
        },
        transaction: {
          id: 307,
          user: {
            id: 28,
            first_name: "abedee",
            last_name: "abebe",
            username: "abedeee"
          },
          store: null,
          category: null,
          place: null,
          account: {
            id: 136,
            name: "ABE AND HOSEA",
            icon: "AccountBalanceWallet",
            color: "#2EB872",
            balance: "5400.00",
            is_default: true,
            user_id: 32
          },
          pair_transaction: null,
          transaction_type: {
            id: 1,
            name: "Income",
            icon: "Savings",
            color: "#006CD1"
          },
          tags: [],
          formatted_amount: "€0.00",
          formatted_net_amount: "€2,400.00",
          formatted_gross_amount: "€2,500.00",
          updated_at: "2026-04-01 12:40 PM",
          created_at: "2026-04-01 12:40 PM",
          deleted_at: null,
          amount: null,
          name: "abe",
          notes: "",
          net_amount: "2400.00",
          gross_amount: "2500.00",
          debit_month_year: "2025-01-01",
          external_transaction_id: null,
          is_recurring: false,
          is_refunded: false,
          refunded_at: null,
          transaction_at: "2026-04-01 12:40 PM",
          previous_balance: "3000.00",
          pair_previous_balance: null,
          created_by: 28,
          updated_by: null,
          deleted_by: null,
          recurring: null
        },
        action: "created",
        old_data: null,
        new_data: null,
        notes: null,
        created_at: "2026-04-01 12:40 PM"
      },
      {
        id: 328,
        performed_by: {
          id: 28,
          first_name: "abedee",
          last_name: "abebe",
          username: "abedeee"
        },
        transaction: null,
        action: "updated",
        old_data: null,
        new_data: null,
        notes: "Transaction date changed",
        created_at: "2026-04-01 11:37 AM"
      },
      {
        id: 317,
        performed_by: {
          id: 28,
          first_name: "abedee",
          last_name: "abebe",
          username: "abedeee"
        },
        transaction: null,
        action: "deleted",
        old_data: null,
        new_data: null,
        notes: null,
        created_at: "2026-03-27 02:26 PM"
      },
      {
        id: 314,
        performed_by: {
          id: 28,
          first_name: "abedee",
          last_name: "abebe",
          username: "abedeee"
        },
        transaction: {
          id: 299,
          user: {
            id: 28,
            first_name: "abedee",
            last_name: "abebe",
            username: "abedeee"
          },
          store: null,
          category: null,
          place: null,
          account: {
            id: 53,
            name: "SAMPLE NAME",
            icon: "MonetizationOn",
            color: "#2EB872",
            balance: "20000.00",
            is_default: false,
            user_id: 28
          },
          pair_transaction: null,
          transaction_type: {
            id: 1,
            name: "Income",
            icon: "Savings",
            color: "#006CD1"
          },
          tags: [],
          formatted_amount: "€0.00",
          formatted_net_amount: "€5,000.00",
          formatted_gross_amount: "€10,000.00",
          updated_at: "2026-03-27 01:18 PM",
          created_at: "2026-03-27 01:18 PM",
          deleted_at: null,
          amount: null,
          name: "5000",
          notes: "",
          net_amount: "5000.00",
          gross_amount: "10000.00",
          debit_month_year: "2026-11-01",
          external_transaction_id: null,
          is_recurring: false,
          is_refunded: false,
          refunded_at: null,
          transaction_at: "2026-03-27 01:18 PM",
          previous_balance: "15000.00",
          pair_previous_balance: null,
          created_by: 28,
          updated_by: null,
          deleted_by: null,
          recurring: null
        },
        action: "created",
        old_data: null,
        new_data: null,
        notes: null,
        created_at: "2026-03-27 01:18 PM"
      }
    ]
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

const formatIncomeReportIntoResponse = (data: IReportFilterParams) => {
  return {
    selected_year: data.selectedYear,
    compare_year: data.compareYear ?? null,
    base_data: [
      {
        month: 1,
        month_label: 'Jan',
        gross_amount: 2500,
        net_amount: 2200,
        companies: [
          {
            name: 'Acme BV',
            gross_amount: 1500,
            net_amount: 1300
          },
          {
            name: 'Northwind',
            gross_amount: 1000,
            net_amount: 900
          }
        ]
      },
      {
        month: 2,
        month_label: 'Feb',
        gross_amount: 1800,
        net_amount: 1600,
        companies: [
          {
            name: 'Acme BV',
            gross_amount: 1800,
            net_amount: 1600
          }
        ]
      }
    ],
    compare_data: data.compareYear ? [
      {
        month: 1,
        month_label: 'Jan',
        gross_amount: 2100,
        net_amount: 1900,
        companies: [
          {
            name: 'Acme BV',
            gross_amount: 2100,
            net_amount: 1900
          }
        ]
      }
    ] : []
  }
}

const formatExpenseReportIntoResponse = () => {
  return {
    selected_year: 2026,
    compare_year: 2025,
    base_data: [
      {
        month: 1,
        date: "Jan",
        categories: {},
        total: "€0.00"
      },
      {
        month: 2,
        date: "Feb",
        categories: {
          "Category For Expenses": "€5,250.00",
          "Category For Meee": "€3,250.00",
          "New Category": "€27,500.00",
          "Parent Category Savings": "€2,300.00",
          "This Is The Subcategory": "€2,850.00",
          "Other": "€3,262.00"
        },
        total: "€44,412.00"
      },
      {
        month: 3,
        date: "Mar",
        categories: {
          "Bababa": "€237.00",
          "New Abe": "€1,500.00",
          "Parent Category Savings": "€80,700.00",
          "Salary": "€300.00",
          "This Is The Subcategory": "€19,230.00",
          "Other": "€17,919.00"
        },
        total: "€119,886.00"
      },
      {
        month: 4,
        date: "Apr",
        categories: {},
        total: "€0.00"
      },
      {
        month: 5,
        date: "May",
        categories: {
          "Salary": "€500.00"
        },
        total: "€500.00"
      },
      {
        month: 6,
        date: "Jun",
        categories: {
          "Category For Meee": "€70,000.00"
        },
        total: "€70,000.00"
      },
      {
        month: 7,
        date: "Jul",
        categories: {},
        total: "€0.00"
      },
      {
        month: 8,
        date: "Aug",
        categories: {},
        total: "€0.00"
      },
      {
        month: 9,
        date: "Sep",
        categories: {},
        total: "€0.00"
      },
      {
        month: 10,
        date: "Oct",
        categories: {},
        total: "€0.00"
      },
      {
        month: 11,
        date: "Nov",
        categories: {},
        total: "€0.00"
      },
      {
        month: 12,
        date: "Dec",
        categories: {},
        total: "€0.00"
      }
    ],
    compare_data: [
      {
        month: 1,
        date: "Jan",
        categories: {},
        total: "€0.00"
      },
      {
        month: 2,
        date: "Feb",
        categories: {},
        total: "€0.00"
      },
      {
        month: 3,
        date: "Mar",
        categories: {},
        total: "€0.00"
      },
      {
        month: 4,
        date: "Apr",
        categories: {},
        total: "€0.00"
      },
      {
        month: 5,
        date: "May",
        categories: {},
        total: "€0.00"
      },
      {
        month: 6,
        date: "Jun",
        categories: {},
        total: "€0.00"
      },
      {
        month: 7,
        date: "Jul",
        categories: {},
        total: "€0.00"
      },
      {
        month: 8,
        date: "Aug",
        categories: {},
        total: "€0.00"
      },
      {
        month: 9,
        date: "Sep",
        categories: {},
        total: "€0.00"
      },
      {
        month: 10,
        date: "Oct",
        categories: {},
        total: "€0.00"
      },
      {
        month: 11,
        date: "Nov",
        categories: {},
        total: "€0.00"
      },
      {
        month: 12,
        date: "Dec",
        categories: {},
        total: "€0.00"
      }
    ]
  }
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
