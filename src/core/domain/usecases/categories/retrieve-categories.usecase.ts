import { IPagedCategoryEntity } from "@domain/entities/category/paged.category.entity"
import { ICategorySearchParams } from "@domain/entities/category/search.entity"

export interface IRetrieveCategoriesDataGateway {
  retrieveCategories: (params: ICategorySearchParams) => Promise<IPagedCategoryEntity>
}

export interface IRetrieveCategoriesDataRepository {
  initializeCategories: (categories: IPagedCategoryEntity, params: ICategorySearchParams) => void
}

export default class RetrieveCategoriesUseCase {
  constructor(
    private readonly dataGateway: IRetrieveCategoriesDataGateway,
    private readonly dataRepository: IRetrieveCategoriesDataRepository
  ) {}

  async execute(params: ICategorySearchParams) {
    const categories = await this.dataGateway.retrieveCategories(params)
    this.dataRepository.initializeCategories(categories, params)
  }
}
