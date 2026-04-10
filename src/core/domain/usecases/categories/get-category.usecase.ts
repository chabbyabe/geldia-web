import { ICategory } from "@domain/entities/category/category.entity"

export interface IGetCategoryDataGateway {
  getCategory: (categoryId?: number) => Promise<ICategory>
}

export interface IGetCategoryDataRepository {
  setCurrentCategory: (category: ICategory) => void
}

export default class GetCategoryUseCase {
  constructor(
    private readonly dataGateway: IGetCategoryDataGateway,
    private readonly dataRepository: IGetCategoryDataRepository
  ) {}

  async execute(categoryId: number) {
    const category = await this.dataGateway.getCategory(categoryId)
    this.dataRepository.setCurrentCategory(category)
  }
}
