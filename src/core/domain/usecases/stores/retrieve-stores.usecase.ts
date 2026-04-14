import { IPagedStoreEntity } from "@domain/entities/store/paged.store.entity"
import { IStoreSearchParams } from "@domain/entities/store/search.entity"

export interface IRetrieveStoresDataGateway {
  retrieveStores: (params: IStoreSearchParams) => Promise<IPagedStoreEntity>
}

export interface IRetrieveStoresDataRepository {
  initializeStores: (stores: IPagedStoreEntity, params: IStoreSearchParams) => void
}

export default class RetrieveStoresUseCase {
  constructor(
    private readonly dataGateway: IRetrieveStoresDataGateway,
    private readonly dataRepository: IRetrieveStoresDataRepository
  ) {}

  async execute(params: IStoreSearchParams) {
    const stores = await this.dataGateway.retrieveStores(params)
    this.dataRepository.initializeStores(stores, params)
  }
}
