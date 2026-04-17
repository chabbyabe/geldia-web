import CategoryApiGateway from "@data/gateways/api/services/category.gateway"
import CategoryRepository from "@data/gateways/api/services/category.repository"
import { ICategory } from "@domain/entities/category/category.entity"
import { ICategorySearchParams } from "@domain/entities/category/search.entity"
import { IFormCategory } from "@domain/entities/formModels/category-form.entity"
import CreateCategoryUseCase from "@domain/usecases/categories/create-category.usecase"
import DeleteCategoryUseCase from "@domain/usecases/categories/delete-category.usecase"
import GetCategoryUseCase from "@domain/usecases/categories/get-category.usecase"
import RetrieveCategoriesUseCase from "@domain/usecases/categories/retrieve-categories.usecase"
import UpdateCategoryUseCase from "@domain/usecases/categories/update-category.usecase"
import RetrieveTransactionFormOptionsUseCase from "@domain/usecases/transactions/retrieve-form-options.usecase"
import TransactionApiGateway from "@data/gateways/api/services/transaction.gateway"
import TransactionRepository from "@data/gateways/api/services/transaction.repository"
import RetrieveUserCategoriesUseCase from "@base/core/domain/usecases/categories/retrieve-user-categories.usecase"

export default class CategoriesController {
  private readonly retrieveCategoriesUseCase: RetrieveCategoriesUseCase
  private readonly createCategoryUseCase: CreateCategoryUseCase
  private readonly updateCategoryUseCase: UpdateCategoryUseCase
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase
  private readonly getCategoryUseCase: GetCategoryUseCase
  private readonly retrieveFormOptionsUseCase: RetrieveTransactionFormOptionsUseCase
  private readonly categoryRepository: CategoryRepository
  private readonly retrieveUserCategory: RetrieveUserCategoriesUseCase

  constructor() {
    this.categoryRepository = new CategoryRepository()
    this.retrieveCategoriesUseCase = new RetrieveCategoriesUseCase(
      new CategoryApiGateway(),
      this.categoryRepository
    )
    this.createCategoryUseCase = new CreateCategoryUseCase(
      new CategoryApiGateway(),
      this.categoryRepository
    )
    this.updateCategoryUseCase = new UpdateCategoryUseCase(
      new CategoryApiGateway(),
      this.categoryRepository
    )
    this.deleteCategoryUseCase = new DeleteCategoryUseCase(
      new CategoryApiGateway(),
      this.categoryRepository
    )
    this.getCategoryUseCase = new GetCategoryUseCase(
      new CategoryApiGateway(),
      this.categoryRepository
    )
    this.retrieveFormOptionsUseCase = new RetrieveTransactionFormOptionsUseCase(
      new TransactionApiGateway(),
      new TransactionRepository()
    )
    this.retrieveUserCategory = new RetrieveUserCategoriesUseCase(
      new CategoryApiGateway(),
      this.categoryRepository
    )
  }

  async retrieveCategories(params: ICategorySearchParams) {
    await this.retrieveCategoriesUseCase.execute(params)
  }

  async retrieveFormOptions() {
    await this.retrieveFormOptionsUseCase.execute()
  }

  clearCurrentCategory() {
    this.categoryRepository.clearCurrentCategory()
  }

  async createCategory(data: IFormCategory) {
    await this.createCategoryUseCase.execute(data)
  }

  async updateCategory(id: number, data: IFormCategory) {
    await this.updateCategoryUseCase.execute(id, data)
  }

  async deleteCategory(category: ICategory) {
    await this.deleteCategoryUseCase.execute(category.id)
  }

  async setCurrentCategory(id: number) {
    await this.getCategoryUseCase.execute(id)
  }

  async retrieveUserCategories() {
    await this.retrieveUserCategory.execute()
  }
}
