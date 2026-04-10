import { ICategory } from "@domain/entities/category/category.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"

export interface IUpdateCategoryDataGateway {
  updateCategory: (id: number, category: IFormCategory) => Promise<ICategory>
}

export interface IUpdateCategoryRepository {
  updateCategory: (category: ICategory) => void
  setCurrentCategory: (category: ICategory) => void
}

export default class UpdateCategoryUseCase {
  constructor(
    private readonly dataGateway: IUpdateCategoryDataGateway,
    private readonly dataRepository: IUpdateCategoryRepository
  ) {}

  async execute(id: number, categoryData: IFormCategory) {
    const updatedCategory = await this.dataGateway.updateCategory(id, categoryData)
    this.dataRepository.updateCategory(updatedCategory)
    this.dataRepository.setCurrentCategory(updatedCategory)
  }
}
