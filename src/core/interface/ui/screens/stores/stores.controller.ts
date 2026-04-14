import StoreApiGateway from "@data/gateways/api/services/store.gateway"
import StoreRepository from "@data/gateways/api/services/store.repository"
import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IStore } from "@domain/entities/store/store.entity"
import { IStoreSearchParams } from "@domain/entities/store/search.entity"
import CreateStoreUseCase from "@domain/usecases/stores/create-store.usecase"
import DeleteStoreUseCase from "@domain/usecases/stores/delete-store.usecase"
import GetStoreUseCase from "@domain/usecases/stores/get-store.usecase"
import RetrieveStoresUseCase from "@domain/usecases/stores/retrieve-stores.usecase"
import UpdateStoreUseCase from "@domain/usecases/stores/update-store.usecase"
import { formatToTitleCase } from "@interface/presenters/helpers"

export default class StoresController {
  private readonly retrieveStoresUseCase: RetrieveStoresUseCase
  private readonly createStoreUseCase: CreateStoreUseCase
  private readonly updateStoreUseCase: UpdateStoreUseCase
  private readonly deleteStoreUseCase: DeleteStoreUseCase
  private readonly getStoreUseCase: GetStoreUseCase
  private readonly storeRepository: StoreRepository

  constructor() {
    this.storeRepository = new StoreRepository()
    this.retrieveStoresUseCase = new RetrieveStoresUseCase(
      new StoreApiGateway(),
      this.storeRepository
    )
    this.createStoreUseCase = new CreateStoreUseCase(
      new StoreApiGateway(),
      this.storeRepository
    )
    this.updateStoreUseCase = new UpdateStoreUseCase(
      new StoreApiGateway(),
      this.storeRepository
    )
    this.deleteStoreUseCase = new DeleteStoreUseCase(
      new StoreApiGateway(),
      this.storeRepository
    )
    this.getStoreUseCase = new GetStoreUseCase(
      new StoreApiGateway(),
      this.storeRepository
    )
  }

  async retrieveStores(params: IStoreSearchParams) {
    await this.retrieveStoresUseCase.execute(params)
  }

  clearCurrentStore() {
    this.storeRepository.clearCurrentStore()
  }

  private normalizePayload(data: IFormStore): IFormStore {
    return {
      ...data,
      name: formatToTitleCase(data.name)
    }
  }

  async createStore(data: IFormStore) {
    await this.createStoreUseCase.execute(this.normalizePayload(data))
  }

  async updateStore(id: number, data: IFormStore) {
    await this.updateStoreUseCase.execute(id, this.normalizePayload(data))
  }

  async deleteStore(item: IStore) {
    await this.deleteStoreUseCase.execute(item.id)
  }

  async setCurrentStore(id: number) {
    await this.getStoreUseCase.execute(id)
  }
}
