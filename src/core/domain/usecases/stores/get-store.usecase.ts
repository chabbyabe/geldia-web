import { IStore } from "@domain/entities/store/store.entity"

export interface IGetStoreDataGateway {
  getStore: (storeId?: number) => Promise<IStore>
}

export interface IGetStoreDataRepository {
  setCurrentStore: (store: IStore) => void
}

export default class GetStoreUseCase {
  constructor(
    private readonly dataGateway: IGetStoreDataGateway,
    private readonly dataRepository: IGetStoreDataRepository
  ) {}

  async execute(storeId: number) {
    const store = await this.dataGateway.getStore(storeId)
    this.dataRepository.setCurrentStore(store)
  }
}
