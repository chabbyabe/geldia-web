export interface IDeleteStoreDataGateway {
  deleteStore: (storeId: number) => Promise<void>
}

export interface IDeleteStoreDataRepository {
  deleteStore: () => void
}

export default class DeleteStoreUseCase {
  constructor(
    private readonly dataGateway: IDeleteStoreDataGateway,
    private readonly dataRepository: IDeleteStoreDataRepository
  ) {}

  async execute(storeId: number) {
    await this.dataGateway.deleteStore(storeId)
    this.dataRepository.deleteStore()
  }
}
