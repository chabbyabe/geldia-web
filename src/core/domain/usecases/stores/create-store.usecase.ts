import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IStore } from "@domain/entities/store/store.entity"

export interface ICreateStoreDataGateway {
  createStore: (store: IFormStore) => Promise<IStore>
}

export interface ICreateStoreRepository {
  setStore: (store: IStore) => void
}

export default class CreateStoreUseCase {
  constructor(
    private readonly dataGateway: ICreateStoreDataGateway,
    private readonly dataRepository: ICreateStoreRepository
  ) {}

  async execute(storeData: IFormStore) {
    const newStore = await this.dataGateway.createStore(storeData)
    this.dataRepository.setStore(newStore)
  }
}
