import { ICategory } from "@domain/entities/category/category.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"

export interface ICreateCategoryDataGateway {
  createCategory: (category: IFormCategory) => Promise<ICategory>
}

export interface ICreateCategoryRepository {
  setCategory: (category: ICategory) => void
}

export default class CreateCategoryUseCase {
  constructor(
    private readonly dataGateway: ICreateCategoryDataGateway,
    private readonly dataRepository: ICreateCategoryRepository
  ) {}

  async execute(categoryData: IFormCategory) {
    const newCategory = await this.dataGateway.createCategory(categoryData)
    this.dataRepository.setCategory(newCategory)
  }
}
