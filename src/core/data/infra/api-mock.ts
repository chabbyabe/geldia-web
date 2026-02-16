import MockAdapter from 'axios-mock-adapter'
import { LOGIN_URL, LOGOUT_URL, REGISTER_URL } from '@data/gateways/api/constants'
import { IFormLogin, IFormSignUp } from '@domain/entities/formModels/signup-form.entity'

export const mockAPIResponses = (
  axiosInstance: any, testError: boolean = false, baseDataRes: any = {}, pk: number | null = null
): void => {
  const mock = new MockAdapter(axiosInstance)
  if (testError) {
    // User Registration
    mock.onPost(REGISTER_URL).reply(400, getUserRegistrationErrorResponse(baseDataRes))
    // Login
    mock.onPost(LOGIN_URL).reply(400, getUserLoginErrorResponse(baseDataRes))

  } else {
    // User Registration
    mock.onPost(REGISTER_URL).reply(201, formatUserCreateIntoResponse(baseDataRes))
    // Login
    mock.onPost(LOGIN_URL).reply(200, formatUserLoginIntoResponse(baseDataRes))
    // Logout
    mock.onPost(LOGOUT_URL).reply(200, formatUserLogoutIntoResponse())
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
