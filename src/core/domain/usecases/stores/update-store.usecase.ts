import { IFormStore } from "@domain/entities/formModels/store-form.entity"
import { IStore } from "@domain/entities/store/store.entity"

export interface IUpdateStoreDataGateway {
  updateStore: (id: number, store: IFormStore) => Promise<IStore>
}

export interface IUpdateStoreRepository {
  updateStore: (store: IStore) => void
  setCurrentStore: (store: IStore) => void
}

export default class UpdateStoreUseCase {
  constructor(
    private readonly dataGateway: IUpdateStoreDataGateway,
    private readonly dataRepository: IUpdateStoreRepository
  ) {}

  async execute(id: number, storeData: IFormStore) {
    const updatedStore = await this.dataGateway.updateStore(id, storeData)
    this.dataRepository.updateStore(updatedStore)
    this.dataRepository.setCurrentStore(updatedStore)
  }
}
