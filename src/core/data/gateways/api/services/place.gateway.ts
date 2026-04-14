import { PLACE_URL } from "@data/gateways/api/constants"
import { IPlaceModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormPlace } from "@domain/entities/formModels/place-form.entity"
import PagedPlaceEntity, { IPagedPlaceEntity } from "@domain/entities/place/paged.place.entity"
import PlaceEntity, { IPlace } from "@domain/entities/place/place.entity"
import { IPlaceSearchParams } from "@domain/entities/place/search.entity"
import { mapErrorAttributes } from "./mappers/error.mappers"
import { mapPagedPlaceAttributes, mapPlaceAttributes } from "./mappers/place.mappers"

export default class PlaceApiGateway extends Api {
  async retrievePlaces(params: IPlaceSearchParams): Promise<IPagedPlaceEntity> {
    try {
      const response = await this._retrievePlaces(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  async getPlace(placeId?: number): Promise<IPlace> {
    try {
      const response = await this._getPlace(placeId)
      return this._mapPlaceFromResponse(response)
    } catch (error) {
      throw error
    }
  }

  async createPlace(placeData: IFormPlace): Promise<IPlace> {
    try {
      const response = await this._createPlace(placeData)
      return this._mapPlaceFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async updatePlace(id: number, placeData: IFormPlace): Promise<IPlace> {
    try {
      const response = await this._updatePlace(id, placeData)
      return this._mapPlaceFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async deletePlace(placeId: number): Promise<void> {
    await this.delete(PLACE_URL + `${placeId}/`)
  }

  private async _retrievePlaces(params: IPlaceSearchParams): Promise<IPagedAPIViewModel<IPlaceModel>> {
    return await this.get(PLACE_URL, params)
  }

  private async _getPlace(placeId?: number): Promise<IPlaceModel> {
    return await this.get(PLACE_URL + `${placeId}/`)
  }

  private async _createPlace(placeData: IFormPlace): Promise<IPlaceModel> {
    return await this.post(PLACE_URL, placeData)
  }

  private async _updatePlace(id: number, placeData: IFormPlace): Promise<IPlaceModel> {
    return await this.patch(PLACE_URL + `${id}/`, placeData)
  }

  private _mapPageFromResponse(response: IPagedAPIViewModel<IPlaceModel>): IPagedPlaceEntity {
    const places = new PagedPlaceEntity(mapPagedPlaceAttributes(response))
    return places.getCurrentValuesAsJSON()
  }

  private _mapPlaceFromResponse(response: IPlaceModel): IPlace {
    const place = new PlaceEntity(mapPlaceAttributes(response))
    return place.getCurrentValuesAsJSON()
  }
}
