import { ILogoutResponseModel, IMessageResponseModel, IUserModel, IUserWithAccessTokenModel } from '@data/gateways/api/api.types'
import { Api } from '@data/infra/api.base'
import { IFormLogin } from '@domain/entities/formModels/signup-form.entity'
import UserEntity, { IUser } from '@domain/entities/user/user.entity'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { mapUserAttributes, mapUserLoginErrorAttributes } from './mappers/user.mappers'
import { CHANGE_PASSWORD_URL, CONFIRM_EMAIL_VERIFICATION_URL, CURRENT_USER_URL, LOGIN_URL, LOGOUT_URL, REQUEST_EMAIL_VERIFICATION_URL } from '@data/gateways/api/constants'
import { tokenStorage } from '@data/infra/token-storage'
import { IUserLoginErrorModel, IUserPasswordChangeErrorModel } from '@data/gateways/api/api-error.types'
import { IFormEmailVerification, IFormEmailVerificationError, IFormPasswordReset, IFormPasswordResetError, IFormPersonalInformation } from '@domain/entities/formModels/settings-form.entity'

export default class AuthApiGateway extends Api {

  async login(loginCredentials: IFormLogin): Promise<IUser> {
    try {
      const response = await this._loginUser(loginCredentials)
      tokenStorage.setAccessToken(response.access)
      return this._mapUserFromResponse(response.user)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _loginUser(loginCredentials: IFormLogin): Promise<IUserWithAccessTokenModel> {
    return await this.post(LOGIN_URL, loginCredentials)
  }

  private _mapUserFromResponse(response: IUserModel): IUser {
    const user = new UserEntity(mapUserAttributes(response))
    return user.getCurrentValuesAsJSON()
  }

  async logout(): Promise<ILogoutResponseModel> {
    try {
      return await this._logoutUser()
    } catch (error) {
      throw error
    } finally {
      tokenStorage.removeAccessToken()
    }
  }

  private async _logoutUser(): Promise<ILogoutResponseModel> {
    return await this.post(LOGOUT_URL)
  }

  async retrieveCurrentUser(): Promise<IUser> {
    const response = await this.get<IUserModel, null>(CURRENT_USER_URL)
    return this._mapUserFromResponse(response)
  }

  async updateCurrentUser(userDetails: IFormPersonalInformation): Promise<IUser> {
    try {
      const response = await this.patch<IUserModel, IUserLoginErrorModel>(CURRENT_USER_URL, userDetails)
      return this._mapUserFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapUserLoginErrorAttributes(error.data))
      }
      throw error
    }
  }

  async changePassword(passwordDetails: IFormPasswordReset): Promise<void> {
    try {
      await this.post<unknown, IUserPasswordChangeErrorModel>(CHANGE_PASSWORD_URL, passwordDetails)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError<IFormPasswordResetError>(error.message, {
          nonFieldErrors: error.data.non_field_errors,
          newPassword1: error.data.new_password1,
          newPassword2: error.data.new_password2,
        })
      }
      throw error
    }
  }

  async requestEmailVerification(): Promise<IMessageResponseModel> {
    try {
      return await this.post<IMessageResponseModel, IUserLoginErrorModel>(REQUEST_EMAIL_VERIFICATION_URL)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError<IFormEmailVerificationError>(error.message, {
          nonFieldErrors: error.data.non_field_errors,
          email: error.data.email,
        })
      }
      throw error
    }
  }

  async confirmEmailVerification(data: IFormEmailVerification): Promise<IMessageResponseModel> {
    try {
      return await this.post<IMessageResponseModel, IUserLoginErrorModel>(CONFIRM_EMAIL_VERIFICATION_URL, data)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError<IFormEmailVerificationError>(error.message, {
          nonFieldErrors: error.data.non_field_errors,
          token: error.data.token,
          email: error.data.email,
        })
      }
      throw error
    }
  }
}
