import { CATEGORY_URL } from "@data/gateways/api/constants"
import { Api } from "@data/infra/api.base"
import { BadRequest } from "@data/infra/api.error"
import { ICategoryModel, IPagedAPIViewModel } from "@data/gateways/api/api.types"
import { FormRequestError } from "@domain/entities/formModels/errors.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import CategoryEntity, { ICategory } from "@domain/entities/category/category.entity"
import PagedCategoryEntity, { IPagedCategoryEntity } from "@domain/entities/category/paged.category.entity"
import { ICategorySearchParams } from "@domain/entities/category/search.entity"
import { mapCategoryAttributes, mapPagedCategoryAttributes } from "./mappers/category.mappers"
import { mapErrorAttributes } from "./mappers/error.mappers"

export default class CategoryApiGateway extends Api {
  async retrieveCategories(params: ICategorySearchParams): Promise<IPagedCategoryEntity> {
    try {
      const response = await this._retrieveCategories(params)
      return this._mapPageFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }

  async getCategory(categoryId?: number): Promise<ICategory> {
    try {
      const response = await this._getCategory(categoryId)
      return this._mapCategoryFromResponse(response)
    } catch (error) {
      throw error
    }
  }

  async createCategory(categoryData: IFormCategory): Promise<ICategory> {
    try {
      const response = await this._createCategory(categoryData)
      return this._mapCategoryFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async updateCategory(id: number, categoryData: IFormCategory): Promise<ICategory> {
    try {
      const response = await this._updateCategory(id, categoryData)
      return this._mapCategoryFromResponse(response)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, mapErrorAttributes(error.data))
      }
      throw error
    }
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.delete(CATEGORY_URL + `${categoryId}/`)
  }

  private async _retrieveCategories(
    params: ICategorySearchParams
  ): Promise<IPagedAPIViewModel<ICategoryModel>> {
    return await this.get(CATEGORY_URL, params)
  }

  private async _getCategory(categoryId?: number): Promise<ICategoryModel> {
    return await this.get(CATEGORY_URL + `${categoryId}/`)
  }

  private async _createCategory(categoryData: IFormCategory): Promise<ICategoryModel> {
    return await this.post(CATEGORY_URL, categoryData)
  }

  private async _updateCategory(id: number, categoryData: IFormCategory): Promise<ICategoryModel> {
    return await this.patch(CATEGORY_URL + `${id}/`, categoryData)
  }

  private _mapPageFromResponse(
    response: IPagedAPIViewModel<ICategoryModel>
  ): IPagedCategoryEntity {
    const categories = new PagedCategoryEntity(mapPagedCategoryAttributes(response))
    return categories.getCurrentValuesAsJSON()
  }

  private _mapCategoryFromResponse(response: ICategoryModel): ICategory {
    const category = new CategoryEntity(mapCategoryAttributes(response))
    return category.getCurrentValuesAsJSON()
  }
}
