import { IAccountSimple, ICategorySimple, IPlaceSimple, IStoreSimple, 
  ITransactionType, ITagSimple 
} from "./transaction.entity"

export interface ITransactionInitial {
  stores: IStoreSimple[]
  places: IPlaceSimple[]
  accounts: IAccountSimple[]
  categories: ICategorySimple[]
  transactionTypes: ITransactionType[]
  tags: ITagSimple[]
}


export default class TransactionInitialFormEntity {
  stores: IStoreSimple[]
  places: IPlaceSimple[]
  accounts: IAccountSimple[]
  categories: ICategorySimple[]
  transactionTypes: ITransactionType[]
  tags: ITagSimple[]

  constructor(model: ITransactionInitial) {
    this.stores = model.stores;
    this.places = model.places;
    this.accounts = model.accounts;
    this.categories = model.categories;
    this.transactionTypes = model.transactionTypes;
    this.tags = model.tags
  }

  getCurrentValuesAsJSON(): ITransactionInitial {
    return Object.assign({}, this);
  }
}

