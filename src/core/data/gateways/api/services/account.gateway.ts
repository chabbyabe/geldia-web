import { IAccountModel, IPagedAPIViewModel } from '@data/gateways/api/api.types'
import { Api } from '@data/infra/api.base'
import { ACCOUNT_URL } from '@data/gateways/api/constants'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { IFormAccount } from '@base/core/domain/entities/formModels/account-form.entity'
import AccountEntity, { IAccount } from '@base/core/domain/entities/account/account.entity'
import { mapAccountAttributes, mapUserAccountAttributes } from './mappers/account.mappers'
import PagedAccountEntity, { IPagedAccountEntity } from '@base/core/domain/entities/account/paged.account.entity'
import { mapErrorAttributes } from './mappers/error.mappers'

export default class AccountApiGateway extends Api {

  private _serializeAccountDetail(accountDetail: IFormAccount) {
    return {
      name: accountDetail.name,
      icon: accountDetail.icon,
      color: accountDetail.color,
      balance: accountDetail.balance,
      countInAssets: accountDetail.countInAssets,
      isDefault: accountDetail.isDefault,
      isShared: accountDetail.isShared,
      notes: accountDetail.notes,
      sharedUserIds: accountDetail.isShared ? (accountDetail.sharedUserIds ?? []) : [],
      categoryIds: accountDetail.categoryIds ?? []
    }
  }

  // Create a new account
  async createAccount(accountDetail: IFormAccount): Promise<IAccount> {
    try {
      const response = await this._createAccount(accountDetail)
      return this._mapAccountFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        const errorData = mapErrorAttributes(error.data)
        throw new FormRequestError(error.message, errorData)
      }
      throw error
    }
  }

  private async _createAccount(accountDetail: IFormAccount) : Promise<IAccountModel> {
    return await this.post(ACCOUNT_URL, this._serializeAccountDetail(accountDetail))
  }

  private _mapAccountFromResponse(response: IAccountModel): IAccount {
    const account = new AccountEntity(mapAccountAttributes(response))
    return account.getCurrentValuesAsJSON()
  }

  // Update account
  async updateAccount(id: number, accountDetail: IFormAccount): Promise<IAccount> {
    try {
      const response = await this._updateAccount(id, accountDetail)
      return this._mapAccountFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        const errorData = mapErrorAttributes(error.data)
        throw new FormRequestError(error.message, errorData)
      }
      throw error
    }
  }

  private async _updateAccount(id: number,accountDetail: IFormAccount) : Promise<IAccountModel> {
    return await this.patch(ACCOUNT_URL + `${id}/`, this._serializeAccountDetail(accountDetail))
  }

  // Get user own accounts
    async retrieveAccounts(page?: number): Promise<IPagedAccountEntity> {
    try {
      const response = await this._retrieveAccounts(page)
      return this._mapUserAccountsFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  private async _retrieveAccounts(page?: number): Promise<IPagedAPIViewModel<IAccountModel>> {
    if (page) {
      return await this.get(ACCOUNT_URL, { 'page': page })
    }
    return await this.get(ACCOUNT_URL)
  }

  private _mapUserAccountsFromResponse(response: IPagedAPIViewModel<IAccountModel>): IPagedAccountEntity {
    const accounts = new PagedAccountEntity(mapUserAccountAttributes(response))
    return accounts.getCurrentValuesAsJSON()
  }

  // Set retrieve selected account (For account edit)
  async getUserAccount(accountId?: number): Promise<IAccount> {
    try {
      const response = await this._getUserAccount(accountId)
      return this._mapAccountFromResponse(response)
    } catch (error) {
      throw error
    }
  }

  private async _getUserAccount(accountId?: number): Promise<IAccountModel>{
      return await this.get(ACCOUNT_URL + `${accountId}/`)
  }

  // Delete account
  async deleteAccount(account: IAccount) : Promise<void> {
    return await this.delete(ACCOUNT_URL + `${account.id}/`)
  }
}
