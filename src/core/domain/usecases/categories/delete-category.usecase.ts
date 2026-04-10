export interface IDeleteCategoryDataGateway {
  deleteCategory: (categoryId: number) => Promise<void>
}

export interface IDeleteCategoryDataRepository {
  deleteCategory: () => void
}

export default class DeleteCategoryUseCase {
  constructor(
    private readonly dataGateway: IDeleteCategoryDataGateway,
    private readonly dataRepository: IDeleteCategoryDataRepository
  ) {}

  async execute(categoryId: number) {
    await this.dataGateway.deleteCategory(categoryId)
    this.dataRepository.deleteCategory()
  }
}
