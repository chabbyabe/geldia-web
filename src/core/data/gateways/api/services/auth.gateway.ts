import { ILogoutResponseModel, IUserModel, IUserWithAccessTokenModel } from '@data/gateways/api/api.types'
import { Api } from '@data/infra/api.base'
import { IFormLogin } from '@domain/entities/formModels/signup-form.entity'
import UserEntity, { IUser } from '@domain/entities/user/user.entity'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { mapUserAttributes } from './mappers/user.mappers'
import { LOGIN_URL, LOGOUT_URL } from '@data/gateways/api/constants'

export default class AuthApiGateway extends Api {

  async login(loginCredentials: IFormLogin): Promise<IUser> {
    try {
      const response = await this._loginUser(loginCredentials)
      sessionStorage.setItem('accessToken', response.access);
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
      sessionStorage.removeItem('accessToken');
      return await this._logoutUser()
    } catch (error) {
      throw error
    }
  }

  private async _logoutUser(): Promise<ILogoutResponseModel> {
    return await this.post(LOGOUT_URL)
  }
}