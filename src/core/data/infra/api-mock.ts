import MockAdapter from 'axios-mock-adapter'
import { REGISTER_URL } from '@data/gateways/api/constants'
import { IFormSignUp } from '@domain/entities/formModels/signup-form.entity'

export const mockAPIResponses = (
  axiosInstance: any, testError: boolean = false, baseDataRes: any = {}, pk: number | null = null
): void => {
  const mock = new MockAdapter(axiosInstance)
  if (testError) {
    // User Registration
    mock.onPost(REGISTER_URL).reply(400, getUserRegistrationErrorResponse(baseDataRes))
  } else {
    // User Registration
    mock.onPost(REGISTER_URL).reply(201, formatUserCreateIntoResponse(baseDataRes))
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
