import { IBaseAPIModel } from "@data/gateways/api/api.types";
import { IFormAccount } from "@domain/entities/formModels/account-form.entity"
import { IBaseDataModelEntity } from "@domain/entities/base/base.entity";
import { IUser } from "@domain/entities/user/user.entity";
import { ICategorySimple, ITransaction } from "@domain/entities/transaction/transaction.entity";

export interface IAccount extends IFormAccount,IBaseAPIModel, IBaseDataModelEntity {
  transactions: ITransaction[]
  hasTransactions: boolean
}

export default class AccountEntity {
  id: number
  name: string
  icon: string | null  
  color: string | null
  balance: number
  countInAssets: boolean
  isDefault: boolean
  isShared: boolean
  isSavings: boolean
  notes: string | null
  user: IUser | null
  sharedUsers: IUser[]
  hasTransactions: boolean
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  categories: ICategorySimple[]
  transactions: ITransaction[] | []

  constructor(model: IAccount) {
    this.id = model.id;
    this.name = model.name;
    this.icon = model.icon ?? null;
    this.color = model.color ?? '#006CD1';
    this.balance = model.balance ?? 0;
    this.countInAssets = model.countInAssets ?? false;
    this.isDefault = model.isDefault;
    this.isShared = model.isShared;
    this.isSavings = model.isSavings;
    this.notes = model.notes ?? null;
    this.user = model.user ?? null;
    this.sharedUsers = model.sharedUsers ?? [];
    this.categories = model.categories ?? [];
    this.hasTransactions = model.hasTransactions;
    this.createdAt = model.createdAt ?? "2022-01-01T00:00:00.000Z";
    this.updatedAt = model.updatedAt ?? null;
    this.deletedAt = model.deletedAt ?? null;
    this.transactions = model.transactions ?? [];
  }

  getCurrentValuesAsJSON(): IAccount {
    return Object.assign({}, this);
  }
}

