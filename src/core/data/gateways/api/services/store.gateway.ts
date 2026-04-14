import { STORE_URL } from "@data/gateways/api/constants"
import { IStoreModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import PagedStoreEntity, { IPagedStoreEntity } from "@domain/entities/store/paged.store.entity"
import StoreEntity, { IStore } from "@domain/entities/store/store.entity"
import { IStoreSearchParams } from "@domain/entities/store/search.entity"
import { mapErrorAttributes } from "./mappers/error.mappers"
import { mapPagedStoreAttributes, mapStoreAttributes } from "./mappers/store.mappers"

export default class StoreApiGateway extends Api {
  async retrieveStores(params: IStoreSearchParams): Promise<IPagedStoreEntity> {
    try {
      const response = await this._retrieveStores(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  async getStore(storeId?: number): Promise<IStore> {
    try {
      const response = await this._getStore(storeId)
      return this._mapStoreFromResponse(response)
    } catch (error) {
      throw error
    }
  }

  async createStore(storeData: IFormStore): Promise<IStore> {
    try {
      const response = await this._createStore(storeData)
      return this._mapStoreFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async updateStore(id: number, storeData: IFormStore): Promise<IStore> {
    try {
      const response = await this._updateStore(id, storeData)
      return this._mapStoreFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async deleteStore(storeId: number): Promise<void> {
    await this.delete(STORE_URL + `${storeId}/`)
  }

  private async _retrieveStores(params: IStoreSearchParams): Promise<IPagedAPIViewModel<IStoreModel>> {
    return await this.get(STORE_URL, params)
  }

  private async _getStore(storeId?: number): Promise<IStoreModel> {
    return await this.get(STORE_URL + `${storeId}/`)
  }

  private async _createStore(storeData: IFormStore): Promise<IStoreModel> {
    return await this.post(STORE_URL, storeData)
  }

  private async _updateStore(id: number, storeData: IFormStore): Promise<IStoreModel> {
    return await this.patch(STORE_URL + `${id}/`, storeData)
  }

  private _mapPageFromResponse(response: IPagedAPIViewModel<IStoreModel>): IPagedStoreEntity {
    const stores = new PagedStoreEntity(mapPagedStoreAttributes(response))
    return stores.getCurrentValuesAsJSON()
  }

  private _mapStoreFromResponse(response: IStoreModel): IStore {
    const store = new StoreEntity(mapStoreAttributes(response))
    return store.getCurrentValuesAsJSON()
  }
}
