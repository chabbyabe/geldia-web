import { ICategory } from "@domain/entities/category/category.entity"

export interface IRetrieveUserCategoriesDataGateway {
  retrieveUserCategories: () => Promise<ICategory[]>
}

export interface IRetrieveUserCategoriesDataRepository {
  setUserCategories: (categories: ICategory[]) => void
}

export default class RetrieveUserCategoriesUseCase {
  constructor(
    private readonly dataGateway: IRetrieveUserCategoriesDataGateway,
    private readonly dataRepository: IRetrieveUserCategoriesDataRepository
  ) {}

  async execute() {
    const categories = await this.dataGateway.retrieveUserCategories()
    this.dataRepository.setUserCategories(categories)
  }
}
