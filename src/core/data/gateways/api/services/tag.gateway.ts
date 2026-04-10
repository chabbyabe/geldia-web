import { TAG_URL } from "@data/gateways/api/constants"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { ITagModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormTag } from "@domain/entities/formModels/tag-form.entity"
import TagEntity, { ITag } from "@domain/entities/tag/tag.entity"
import PagedTagEntity, { IPagedTagEntity } from "@domain/entities/tag/paged.tag.entity"
import { ITagSearchParams } from "@domain/entities/tag/search.entity"
import { mapTagAttributes, mapPagedTagAttributes } from "./mappers/tag.mappers"
import { mapErrorAttributes } from "./mappers/error.mappers"

export default class TagApiGateway extends Api {
  async retrieveTags(params: ITagSearchParams): Promise<IPagedTagEntity> {
    try {
      const response = await this._retrieveTags(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  async getTag(tagId?: number): Promise<ITag> {
    try {
      const response = await this._getTag(tagId)
      return this._mapTagFromResponse(response)
    } catch (error) {
      throw error
    }
  }

  async createTag(tagData: IFormTag): Promise<ITag> {
    try {
      const response = await this._createTag(tagData)
      return this._mapTagFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async updateTag(id: number, tagData: IFormTag): Promise<ITag> {
    try {
      const response = await this._updateTag(id, tagData)
      return this._mapTagFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async deleteTag(tagId: number): Promise<void> {
    await this.delete(TAG_URL + `${tagId}/`)
  }

  private async _retrieveTags(
    params: ITagSearchParams
  ): Promise<IPagedAPIViewModel<ITagModel>> {
    return await this.get(TAG_URL, params)
  }

  private async _getTag(tagId?: number): Promise<ITagModel> {
    return await this.get(TAG_URL + `${tagId}/`)
  }

  private async _createTag(tagData: IFormTag): Promise<ITagModel> {
    return await this.post(TAG_URL, tagData)
  }

  private async _updateTag(id: number, tagData: IFormTag): Promise<ITagModel> {
    return await this.patch(TAG_URL + `${id}/`, tagData)
  }

  private _mapPageFromResponse(
    response: IPagedAPIViewModel<ITagModel>
  ): IPagedTagEntity {
    const tags = new PagedTagEntity(mapPagedTagAttributes(response))
    return tags.getCurrentValuesAsJSON()
  }

  private _mapTagFromResponse(response: ITagModel): ITag {
    const tag = new TagEntity(mapTagAttributes(response))
    return tag.getCurrentValuesAsJSON()
  }
}
