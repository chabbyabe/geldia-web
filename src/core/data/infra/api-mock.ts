import MockAdapter from 'axios-mock-adapter'
import {
  ACCOUNT_URL,
  API_URL,
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
} from '@data/gateways/api/constants'
import { IFormLogin, IFormSignUp } from '@domain/entities/formModels/signup-form.entity'
import { IYearOverviewFilterParams } from '@domain/entities/dashboard/filter.entity'
import { escapeRegExpForApiRequest, getIdFromUrl } from '@base/core/data/utils/regex.utils'
import { IFormAccount } from '@base/core/domain/entities/formModels/account-form.entity'

const MOCK_URLS = {
  REGISTER: REGISTER_URL,
  LOGIN: LOGIN_URL,
  LOGOUT: LOGOUT_URL,
  DASHBOARD: {
    YEAR_OVERVIEW: new RegExp(`^${escapeRegExpForApiRequest(API_URL.DASHBOARD.yearOverview)}\\?.*$`),
  },
  ACCOUNT: {
    BASE: ACCOUNT_URL,
    DETAIL: new RegExp(`^${escapeRegExpForApiRequest(ACCOUNT_URL)}\\d+/$`),
  }
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
    mock.onGet(MOCK_URLS.DASHBOARD.YEAR_OVERVIEW).reply(
      400,
      getDashboardYearOverviewErrorResponse(baseDataRes),
    )
    // Accounts
    mock.onGet(MOCK_URLS.ACCOUNT.BASE).reply(400, getAccountErrorResponse(baseDataRes))
    mock.onGet(MOCK_URLS.ACCOUNT.DETAIL).reply(
      400,
      getAccountErrorResponse(baseDataRes),
    )
  } else {
    // User Registration
    mock.onPost(MOCK_URLS.REGISTER).reply(201, formatUserCreateIntoResponse(baseDataRes))
    // Login
    mock.onPost(MOCK_URLS.LOGIN).reply(200, formatUserLoginIntoResponse(baseDataRes))
    // Logout
    mock.onPost(MOCK_URLS.LOGOUT).reply(200, formatUserLogoutIntoResponse())
    // Dashboard
    mock.onGet(MOCK_URLS.DASHBOARD.YEAR_OVERVIEW).reply(
      200,
      formatDashboardYearOverviewIntoResponse(baseDataRes),
    )
    // Accounts
    mock.onGet(MOCK_URLS.ACCOUNT.BASE).reply(200, formatRetrieveAccountsIntoResponse(baseDataRes))
    mock.onGet(MOCK_URLS.ACCOUNT.DETAIL).reply((config) => {
      return [200, formatAccountIntoResponse(baseDataRes.accountForm, getIdFromUrl(config.url))]
    })
  }
}

/** Logout */
const formatUserLogoutIntoResponse = () => {
  return {
    "detail": "Successfully logged out."
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
