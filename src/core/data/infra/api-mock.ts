import MockAdapter from 'axios-mock-adapter'
import {
  ACCOUNT_URL,
  API_URL,
  CATEGORY_URL,
  COMPANY_URL,
  LOGIN_URL,
  LOGS_ACCOUNT_URL,
  LOGS_TRANSACTION_URL,
  LOGOUT_URL,
  PLACE_URL,
  REGISTER_URL,
  STORE_URL,
  TAG_URL,
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
  CATEGORY: {
    BASE: CATEGORY_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(CATEGORY_URL)}\\d+/$`),
    USER_CATEGORY: API_URL.CATEGORY.userCategory,
  },
  COMPANY: {
    BASE: COMPANY_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(COMPANY_URL)}\\d+/$`),
  },
  TAG: {
    BASE: TAG_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(TAG_URL)}\\d+/$`),
  },
  STORE: {
    BASE: STORE_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(STORE_URL)}\\d+/$`),
  },
  PLACE: {
    BASE: PLACE_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(PLACE_URL)}\\d+/$`),
  },
  TRANSACTION: {
    FORM_INITIAL: `${TRANSACTION_URL}initial/list/`,
    BASE: TRANSACTION_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(TRANSACTION_URL)}\\d+/$`),
  },
  LOGS: {
    BASE: LOGS_TRANSACTION_URL,
    ACCOUNT: LOGS_ACCOUNT_URL,
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
    mock.onGet(MOCK_URLS.DASHBOARD.SUMMARY_OVERVIEW).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.DASHBOARD.RECENT_TRANSACTIONS).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.DASHBOARD.YEAR_OVERVIEW).reply(400, getDashboardYearOverviewErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.REPORT.INCOME).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.REPORT.EXPENSE).reply(400, getGeneralErrorResponse(baseDataRes))
    // Accounts
    mock.onGet(MOCK_URLS.ACCOUNT.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.ACCOUNT.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.ACCOUNT.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.ACCOUNT.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.ACCOUNT.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.CATEGORY.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.CATEGORY.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.CATEGORY.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.CATEGORY.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.CATEGORY.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.CATEGORY.USER_CATEGORY).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.COMPANY.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.COMPANY.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.COMPANY.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.COMPANY.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.COMPANY.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TAG.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TAG.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.TAG.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.TAG.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.TAG.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.STORE.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.STORE.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.STORE.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.STORE.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.STORE.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.PLACE.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.PLACE.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.PLACE.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.PLACE.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.PLACE.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    // Transactions
    mock.onGet(MOCK_URLS.TRANSACTION.FORM_INITIAL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TRANSACTION.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.TRANSACTION.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPost(MOCK_URLS.TRANSACTION.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.TRANSACTION.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onDelete(MOCK_URLS.TRANSACTION.DETAIL).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.LOGS.BASE).reply(400, getGeneralErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.LOGS.ACCOUNT).reply(400, getGeneralErrorResponse(baseDataRes))
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
    // Categories
    mock.onGet(MOCK_URLS.CATEGORY.BASE).reply(200, formatRetrieveCategoriesIntoResponse())
    mock.onGet(MOCK_URLS.CATEGORY.DETAIL).reply((config) => {
      return [200, formatCategoryIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onPost(MOCK_URLS.CATEGORY.BASE).reply(201, formatCategoryIntoResponse(73))
    mock.onPatch(MOCK_URLS.CATEGORY.DETAIL).reply((config) => {
      return [200, formatCategoryIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.CATEGORY.DETAIL).reply(204)
    mock.onGet(MOCK_URLS.CATEGORY.USER_CATEGORY).reply(200, formatUserCategoryDetailIntoResponse())
    mock.onGet(MOCK_URLS.COMPANY.BASE).reply(200, formatRetrieveCompaniesIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.COMPANY.DETAIL).reply((config) => {
      return [200, formatCompanyIntoResponse(baseDataRes, getIdFromUrl(config.url))]
    })
    mock.onPost(MOCK_URLS.COMPANY.BASE).reply(201, formatCompanyIntoResponse(baseDataRes))
    mock.onPatch(MOCK_URLS.COMPANY.DETAIL).reply((config) => {
      return [200, formatCompanyIntoResponse(baseDataRes, getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.COMPANY.DETAIL).reply(204)
    // Tags
    mock.onGet(MOCK_URLS.TAG.BASE).reply(200, formatRetrieveTagsIntoResponse())
    mock.onGet(MOCK_URLS.TAG.DETAIL).reply((config) => {
      return [200, formatTagIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onPost(MOCK_URLS.TAG.BASE).reply(201, formatTagIntoResponse(73))
    mock.onPatch(MOCK_URLS.TAG.DETAIL).reply((config) => {
      return [200, formatTagIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.TAG.DETAIL).reply(204)
    // Stores
    mock.onGet(MOCK_URLS.STORE.BASE).reply(200, formatRetrieveStoresIntoResponse())
    mock.onGet(MOCK_URLS.STORE.DETAIL).reply((config) => {
      return [200, formatStoreIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onPost(MOCK_URLS.STORE.BASE).reply(201, formatStoreIntoResponse(73))
    mock.onPatch(MOCK_URLS.STORE.DETAIL).reply((config) => {
      return [200, formatStoreIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.STORE.DETAIL).reply(204)
    // Places
    mock.onGet(MOCK_URLS.PLACE.BASE).reply(200, formatRetrievePlacesIntoResponse())
    mock.onGet(MOCK_URLS.PLACE.DETAIL).reply((config) => {
      return [200, formatPlaceIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onPost(MOCK_URLS.PLACE.BASE).reply(201, formatPlaceIntoResponse(73))
    mock.onPatch(MOCK_URLS.PLACE.DETAIL).reply((config) => {
      return [200, formatPlaceIntoResponse(getIdFromUrl(config.url))]
    })
    mock.onDelete(MOCK_URLS.PLACE.DETAIL).reply(204)
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
    mock.onGet(MOCK_URLS.LOGS.ACCOUNT).reply(200, formatRetrieveAccountLogsIntoResponse())
  }
}

const getGeneralErrorResponse = (data: any) => {
  return {
    "non_field_errors": [data?.errorMessage ?? data ?? 'failed'],
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
          pair_account: null,
          transaction_type: {
            id: 1,
            name: "Income",
            icon: "Savings",
            color: "#006CD1"
          },
          tags: [],
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
          pair_account: null,
          transaction_type: {
            id: 1,
            name: "Income",
            icon: "Savings",
            color: "#006CD1"
          },
          tags: [],
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

const formatRetrieveAccountLogsIntoResponse = () => {
  return {
    count: 1,
    total_pages: 1,
    current_page_number: 1,
    next: null,
    previous: null,
    results: [
      {
        id: 1,
        account: {
          id: 5,
          name: "15520562",
          icon: "Savings",
          color: "#006CD1",
          balance: "70.00",
          is_default: false,
          is_savings: true,
          user_id: 1,
          categories: [
            {
              id: 19,
              name: "Savings",
              color: "#F5A524",
              icon: "Savings",
              notes: "",
              transaction_type: {
                id: 1,
                name: "Income",
                icon: "Savings",
                color: "#006CD1"
              },
              parent_category: null
            }
          ]
        },
        action: "updated",
        performed_by: {
          id: 1,
          first_name: "Abegail",
          last_name: "Isidro",
          username: "grenalyn.klimp@gmail.com"
        },
        old_data: {
          id: 5,
          icon: null,
          name: "15520562",
          color: "#006CD1",
          notes: "",
          balance: "70.00",
          user_id: 1,
          is_shared: false,
          is_default: false,
          is_savings: true,
          category_ids: [19],
          count_in_assets: false,
          shared_user_ids: []
        },
        new_data: {
          id: 5,
          icon: "Savings",
          name: "15520562",
          color: "#006CD1",
          notes: "This is my savings",
          balance: "70.00",
          user_id: 1,
          is_shared: false,
          is_default: false,
          is_savings: true,
          category_ids: [19],
          count_in_assets: false,
          shared_user_ids: []
        },
        note: null,
        created_at: "2026-05-07 05:35 PM"
      }
    ]
  }
}

const formatCategoryIntoResponse = (categoryId: number = 63) => ({
  id: categoryId,
  created_by: {
    id: 28,
    first_name: "abedee",
    last_name: "abebe",
    username: "abedeee"
  },
  updated_by: null,
  deleted_by: null,
  transaction_type: {
    id: 2,
    name: "Expenses",
    icon: "Payments",
    color: "#E5484D"
  },
  parent_category: null,
  updated_at: "2026-03-03 10:45 AM",
  created_at: "2026-03-03 10:45 AM",
  deleted_at: null,
  name: categoryId === 63 ? "Abe Category" : "New Category",
  notes: null,
  color: null,
  icon: null,
  children: []
})

const formatRetrieveCategoriesIntoResponse = () => ({
  count: 2,
  total_pages: 1,
  current_page_number: 1,
  next: null,
  previous: null,
  results: [
    formatCategoryIntoResponse(63),
    {
      ...formatCategoryIntoResponse(65),
      transaction_type: {
        id: 3,
        name: "Transfer",
        icon: "Transfer",
        color: "#F5A524"
      },
      name: "Category For Meee"
    }
  ]
})

const formatUserCategoryDetailIntoResponse = (categoryId: number = 46) => {
  return [
    {
      id: 53,
      created_by: {
        id: 3,
        first_name: "abe",
        last_name: "easydraw",
        username: "aoizen"
      },
      updated_by: {
        id: 3,
        first_name: "abe",
        last_name: "easydraw",
        username: "aoizen"
      },
      deleted_by: null,
      transaction_type: {
        id: 2,
        name: "Expenses",
        icon: "Payments",
        color: "#E5484D"
      },
      parent_category: {
        id: 46,
        name: "Mistletoe",
        color: null,
        icon: null
      },
      updated_at: "2026-04-16 07:42 PM",
      created_at: "2026-04-16 07:03 PM",
      deleted_at: null,
      name: "Wactober",
      notes: "asdd asddd asd sad ddd",
      color: "#2EB872",
      icon: "TrendingDown",
    },
    {
      id: categoryId,
      created_by: {
        id: 3,
        first_name: "abe",
        last_name: "easydraw",
        username: "aoizen"
      },
      updated_by: {
        id: 3,
        first_name: "abe",
        last_name: "easydraw",
        username: "aoizen"
      },
      deleted_by: null,
      transaction_type: {
        id: 2,
        name: "Expenses",
        icon: "Payments",
        color: "#E5484D"
      },
      parent_category: null,
      updated_at: "2026-04-16 01:47 PM",
      created_at: "2026-04-16 01:47 PM",
      deleted_at: null,
      name: "Mistletoe",
      notes: null,
      color: null,
      icon: null,
    }]
}

const formatTagIntoResponse = (tagId: number = 63) => ({
  id: tagId,
  created_by: {
    id: 28,
    first_name: "abedee",
    last_name: "abebe",
    username: "abedeee"
  },
  updated_by: null,
  deleted_by: null,
  updated_at: "2026-03-03 10:45 AM",
  created_at: "2026-03-03 10:45 AM",
  deleted_at: null,
  name: tagId === 63 ? "Daily" : "Work",
  color: tagId === 63 ? "#006CD1" : "#E5484D"
})

const formatRetrieveTagsIntoResponse = () => ({
  count: 2,
  total_pages: 1,
  current_page_number: 1,
  next: null,
  previous: null,
  results: [
    formatTagIntoResponse(63),
    formatTagIntoResponse(65),
  ]
})

const formatStoreIntoResponse = (storeId: number = 63) => ({
  id: storeId,
  created_by: {
    id: 28,
    first_name: "abedee",
    last_name: "abebe",
    username: "abedeee"
  },
  updated_by: null,
  deleted_by: null,
  updated_at: "2026-03-03 10:45 AM",
  created_at: "2026-03-03 10:45 AM",
  deleted_at: null,
  name: storeId === 63 ? "Albert Heijn" : "Jumbo",
})

const formatRetrieveStoresIntoResponse = () => ({
  count: 2,
  total_pages: 1,
  current_page_number: 1,
  next: null,
  previous: null,
  results: [
    formatStoreIntoResponse(63),
    formatStoreIntoResponse(65),
  ]
})

const formatPlaceIntoResponse = (placeId: number = 63) => ({
  id: placeId,
  created_by: {
    id: 28,
    first_name: "abedee",
    last_name: "abebe",
    username: "abedeee"
  },
  updated_by: null,
  deleted_by: null,
  updated_at: "2026-03-03 10:45 AM",
  created_at: "2026-03-03 10:45 AM",
  deleted_at: null,
  name: placeId === 63 ? "Amsterdam" : "Rotterdam",
})

const formatRetrievePlacesIntoResponse = () => ({
  count: 2,
  total_pages: 1,
  current_page_number: 1,
  next: null,
  previous: null,
  results: [
    formatPlaceIntoResponse(63),
    formatPlaceIntoResponse(65),
  ]
})

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
const formatDashboardSummaryOverviewIntoResponse = () => {
  return [
    {
      "name": "Income",
      "icon": "Savings",
      "color": "#006CD1",
      "amount": "185489.00",
    },
    {
      "name": "Expenses",
      "icon": "Payments",
      "color": "#E5484D",
      "amount": "293402.00",
    },
    {
      "name": "Savings",
      "icon": "Balance",
      "color": "#F5A524",
      "amount": "49200.00",
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

const formatCategoryOverview = (category: ICategoryOverview) => {
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

const getMockCompanies = (data: any) => {
  return data?.companies ?? [
    {
      id: 5,
      created_by: {
        id: 1,
        name: "abe",
        first_name: "abe first",
        last_name: "abe last name",
        username: "abe",
        email: "abe@example.com"
      },
      updated_by: null,
      is_current: false,
      joined_at: null,
      resigned_at: null,
      updated_at: "2026-05-04 12:12 PM",
      created_at: "2026-05-04 12:12 PM",
      deleted_at: null,
      name: "Abe",
      deleted_by: null
    },
    {
      id: 2,
      created_by: {
        id: 1,
        name: "abe",
        first_name: "abe first",
        last_name: "abe last name",
        username: "abe",
        email: "abe@example.com"
      },
      updated_by: null,
      is_current: false,
      joined_at: null,
      resigned_at: null,
      updated_at: "2026-05-04 11:42 AM",
      created_at: "2026-05-04 11:42 AM",
      deleted_at: null,
      name: "Sample",
      deleted_by: null
    }
  ]
}

const formatRetrieveCompaniesIntoResponse = (data: any) => {
  return getMockCompanies(data)
}

const formatCompanyIntoResponse = (data: any, id: number = 73) => {
  const companies = getMockCompanies(data)
  const existingCompany = companies.find((company: { id: number }) => company.id === id)

  if (existingCompany) {
    return existingCompany
  }

  return {
    id,
    created_by: {
      id: 1,
      name: "abe",
      first_name: "abe first",
      last_name: "abe last name",
      username: "abe",
      email: "abe@example.com"
    },
    updated_by: null,
    is_current: data?.isCurrent ?? false,
    joined_at: data?.joinedAt ?? null,
    resigned_at: data?.resignedAt ?? null,
    updated_at: "2026-05-04 12:12 PM",
    created_at: "2026-05-04 12:12 PM",
    deleted_at: null,
    name: data?.name ?? "Sample",
    deleted_by: null
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
        parent_categories: {
          "Monthly Expenses": {
            categories: {
              "Eat Out": 21.95,
              Furnitures: 7.48,
              Gift: 50.0,
              Groceries: 400.83,
              Others: 1406.65,
              Tithes: 40.0
            },
            total: 1926.91
          },
          House: {
            categories: {
              "Electricity & Gas": 121.42,
              Internet: 64.29,
              Rent: 934.37,
              Water: 21.0
            },
            total: 1141.08
          },
          Other: {
            categories: {
              Hardware: 16.49,
              Savings: 7.8
            },
            total: 24.29
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": 570.63,
              Mobile: 20.88,
              Transportation: 101.13
            },
            total: 692.64
          }
        },
        total: 3784.92
      },
      {
        month: 2,
        date: "Feb",
        parent_categories: {
          "Monthly Payables": {
            categories: {
              Allowance: 71.0,
              "Health Insurance": 1491.43,
              Mobile: 22.15,
              Transportation: 81.14
            },
            total: 1665.72
          },
          Other: {
            categories: {
              Clothing: 32.94,
              Savings: 8.0
            },
            total: 40.94
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": 132.25,
              Gift: 350.0,
              Groceries: 426.38,
              Others: 349.17,
              Tithes: 30.0
            },
            total: 1287.8
          },
          House: {
            categories: {
              "Electricity & Gas": 34.0,
              Internet: 84.86,
              Rent: 934.37
            },
            total: 1053.23
          }
        },
        total: 4047.69
      },
      {
        month: 3,
        date: "Mar",
        parent_categories: {
          Other: {
            categories: {
              Care: 30.0,
              Hardware: 18.98,
              Savings: 8.0
            },
            total: 56.98
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": 55.95,
              Furnitures: 66.74,
              Gift: 200.28,
              Groceries: 537.25,
              Others: 124.13,
              Tithes: 40.0
            },
            total: 1024.35
          },
          House: {
            categories: {
              "Electricity & Gas": 208.84,
              Internet: 72.75,
              Rent: 934.37,
              Water: 42.0
            },
            total: 1257.96
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": 413.72,
              Mobile: 20.88,
              Transportation: 52.75
            },
            total: 487.35
          }
        },
        total: 2826.64
      },
      {
        month: 4,
        date: "Apr",
        parent_categories: {
          "Monthly Payables": {
            categories: {
              Allowance: 150.0,
              "Health Insurance": 413.72,
              Mobile: 20.88,
              Transportation: 82.05
            },
            total: 666.65
          },
          Other: {
            categories: {
              Clothing: 58.44,
              Hardware: 29.83,
              Savings: 8.0
            },
            total: 96.27
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": 46.15,
              Gift: 150.0,
              Groceries: 585.39,
              Others: 333.81,
              Tithes: 30.0
            },
            total: 1145.35
          },
          House: {
            categories: {
              "Electricity & Gas": 121.42,
              Internet: 64.29,
              Rent: 934.37,
              Water: 21.0
            },
            total: 1141.08
          }
        },
        total: 3049.35
      },
      {
        month: 5,
        date: "May",
        parent_categories: {
          "Monthly Expenses": {
            categories: {
              Groceries: 119.09,
              Others: 138.09,
              Tithes: 10.0
            },
            total: 267.18
          },
          Other: {
            categories: {
              Hardware: 13.98
            },
            total: 13.98
          },
          House: {
            categories: {
              Rent: 934.37
            },
            total: 934.37
          }
        },
        total: 1215.53
      },
      { month: 6, date: "Jun", parent_categories: {}, total: 0 },
      { month: 7, date: "Jul", parent_categories: {}, total: 0 },
      { month: 8, date: "Aug", parent_categories: {}, total: 0 },
      { month: 9, date: "Sep", parent_categories: {}, total: 0 },
      { month: 10, date: "Oct", parent_categories: {}, total: 0 },
      { month: 11, date: "Nov", parent_categories: {}, total: 0 },
      { month: 12, date: "Dec", parent_categories: {}, total: 0 }
    ],
    compare_data: [
      {
        month: 1,
        date: "Jan",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "5.99",
              Electronics: "34.99",
              Savings: "3.65"
            },
            total: "44.63"
          },
          "Monthly Expenses": {
            categories: {
              Gift: "211.99",
              Groceries: "72.69",
              Others: "438.25"
            },
            total: "722.93"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "184.56",
              Mobile: "15.10",
              Transportation: "274.75"
            },
            total: "474.41"
          },
          House: {
            categories: {
              Internet: "21.15"
            },
            total: "21.15"
          }
        },
        total: "1263.12"
      },
      {
        month: 2,
        date: "Feb",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "39.99",
              Hardware: "38.98",
              Savings: "3.90",
              Travel: "294.89"
            },
            total: "377.76"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "2.45",
              Gift: "643.98",
              Groceries: "67.60",
              Others: "223.67"
            },
            total: "937.70"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "165.21",
              Mobile: "15.10",
              Transportation: "258.78"
            },
            total: "439.09"
          },
          House: {
            categories: {
              Internet: "45.34"
            },
            total: "45.34"
          }
        },
        total: "1799.89"
      },
      {
        month: 3,
        date: "Mar",
        parent_categories: {
          "Monthly Expenses": {
            categories: {
              "Eat Out": "97.80",
              Gift: "251.99",
              Groceries: "50.13",
              Others: "225.69"
            },
            total: "625.61"
          },
          Other: {
            categories: {
              Government: "243.00",
              Savings: "3.90",
              Travel: "1057.96"
            },
            total: "1304.86"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "165.21",
              Mobile: "15.10",
              Transportation: "82.18"
            },
            total: "262.49"
          },
          House: {
            categories: {
              Internet: "13.90"
            },
            total: "13.90"
          }
        },
        total: "2206.86"
      },
      {
        month: 4,
        date: "Apr",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "26.39",
              Hardware: "8.98",
              Savings: "3.90"
            },
            total: "39.27"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "4.80",
              Gift: "445.99",
              Groceries: "114.52",
              Others: "925.61"
            },
            total: "1490.92"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "197.49",
              Mobile: "15.10",
              Transportation: "10.60"
            },
            total: "223.19"
          },
          House: {
            categories: {
              Internet: "28.40"
            },
            total: "28.40"
          }
        },
        total: "1781.78"
      },
      {
        month: 5,
        date: "May",
        parent_categories: {
          Other: {
            categories: {
              Electronics: "5.98",
              Savings: "3.90"
            },
            total: "9.88"
          },
          "Monthly Expenses": {
            categories: {
              Furnitures: "7.78",
              Gift: "11.90",
              Groceries: "109.53",
              Others: "1885.25"
            },
            total: "2014.46"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "165.21",
              Mobile: "15.10",
              Transportation: "25.07"
            },
            total: "205.38"
          },
          House: {
            categories: {
              Internet: "21.15"
            },
            total: "21.15"
          }
        },
        total: "2250.87"
      },
      {
        month: 6,
        date: "Jun",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "1.39",
              Electronics: "6.98",
              Hardware: "17.99",
              Savings: "3.90"
            },
            total: "30.26"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "119.55",
              Furnitures: "500.56",
              Groceries: "473.84",
              Others: "972.24"
            },
            total: "2066.19"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "293.14",
              Mobile: "20.10",
              Transportation: "110.67"
            },
            total: "423.91"
          },
          House: {
            categories: {
              Internet: "13.90"
            },
            total: "13.90"
          }
        },
        total: "2534.26"
      },
      {
        month: 7,
        date: "Jul",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "23.10",
              Hardware: "12.29",
              Savings: "3.90",
              Travel: "2071.90"
            },
            total: "2111.19"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "28.80",
              Furnitures: "1158.10",
              Groceries: "338.65",
              Others: "3601.57"
            },
            total: "5127.12"
          },
          House: {
            categories: {
              "Electricity & Gas": "130.50",
              Internet: "28.40",
              Rent: "331.55"
            },
            total: "490.45"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "732.79",
              Mobile: "20.10",
              Transportation: "79.52"
            },
            total: "832.41"
          }
        },
        total: "8561.17"
      },
      {
        month: 8,
        date: "Aug",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "26.44",
              Electronics: "34.99",
              Hardware: "12.28",
              Refund: "800.00",
              Savings: "3.90"
            },
            total: "877.61"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "15.10",
              Furnitures: "1502.90",
              Gift: "1005.97",
              Groceries: "374.14",
              Others: "660.40"
            },
            total: "3558.51"
          },
          House: {
            categories: {
              "Electricity & Gas": "226.64",
              Internet: "116.84",
              Rent: "934.37"
            },
            total: "1277.85"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "359.50",
              Mobile: "20.10",
              Transportation: "37.85"
            },
            total: "417.45"
          }
        },
        total: "6131.42"
      },
      {
        month: 9,
        date: "Sep",
        parent_categories: {
          House: {
            categories: {
              "Electricity & Gas": "130.32",
              Internet: "73.35",
              Rent: "934.37",
              Water: "40.00"
            },
            total: "1178.04"
          },
          "Monthly Expenses": {
            categories: {
              Furnitures: "23.47",
              Gift: "1103.98",
              Groceries: "555.30",
              Others: "1334.94"
            },
            total: "3017.69"
          },
          Other: {
            categories: {
              Hardware: "50.10",
              Savings: "3.90",
              Travel: "180.00"
            },
            total: "234.00"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "359.50",
              Mobile: "20.10",
              Transportation: "54.01"
            },
            total: "433.61"
          }
        },
        total: "4863.34"
      },
      {
        month: 10,
        date: "Oct",
        parent_categories: {
          Other: {
            categories: {
              Clothing: "14.99",
              Hardware: "29.60",
              Savings: "3.90"
            },
            total: "48.49"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "16.00",
              Furnitures: "12.97",
              Gift: "608.16",
              Groceries: "294.30",
              Others: "2142.44"
            },
            total: "3073.87"
          },
          House: {
            categories: {
              "Electricity & Gas": "34.00",
              Internet: "96.34",
              Rent: "934.37",
              Water: "20.00"
            },
            total: "1084.71"
          },
          "Monthly Payables": {
            categories: {
              "Health Insurance": "359.50",
              Mobile: "20.73",
              Transportation: "102.90"
            },
            total: "483.13"
          }
        },
        total: "4690.20"
      },
      {
        month: 11,
        date: "Nov",
        parent_categories: {
          "Monthly Payables": {
            categories: {
              Allowance: "110.00",
              "Health Insurance": "376.51",
              Mobile: "21.84",
              Transportation: "47.73"
            },
            total: "556.08"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "62.50",
              Furnitures: "47.97",
              Groceries: "554.19",
              Others: "2592.44"
            },
            total: "3257.10"
          },
          House: {
            categories: {
              "Electricity & Gas": "118.62",
              Internet: "76.99",
              Rent: "934.37",
              Water: "20.00"
            },
            total: "1149.98"
          },
          Other: {
            categories: {
              Hardware: "1.29",
              Refund: "5.04",
              Savings: "5.54"
            },
            total: "11.87"
          }
        },
        total: "4975.03"
      },
      {
        month: 12,
        date: "Dec",
        parent_categories: {
          "Monthly Payables": {
            categories: {
              Allowance: "100.00",
              "Health Insurance": "527.63",
              Mobile: "20.73",
              Transportation: "85.58"
            },
            total: "733.94"
          },
          Other: {
            categories: {
              Clothing: "140.39",
              Refund: "121.00",
              Savings: "7.80"
            },
            total: "269.19"
          },
          "Monthly Expenses": {
            categories: {
              "Eat Out": "21.70",
              Gift: "39.99",
              Groceries: "527.44",
              Others: "219.07",
              Tithes: "30.00"
            },
            total: "838.20"
          },
          House: {
            categories: {
              "Electricity & Gas": "95.22",
              Internet: "80.24",
              Rent: "934.37",
              Water: "20.00"
            },
            total: "1129.83"
          }
        },
        total: "2971.16"
      }
    ]
  }
}

/** Accounts **/
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
    "debit_month_year": transactionForm.debitMonthYear,
    "external_transaction_id": transactionForm.externalTransactionId,
    "pair_account": transactionForm.pairAccount
      ? {
        "id": transactionForm.pairAccount,
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
