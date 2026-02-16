import { IBaseAPIModel } from "@data/gateways/api/api.types";
import { IFormAccount } from "@domain/entities/formModels/account-form.entity"
import { IBaseDataModelEntity } from "@domain/entities/base/base.entity";
import { IUser } from "@domain/entities/user/user.entity";

export interface IAccount extends IFormAccount,IBaseAPIModel, IBaseDataModelEntity {
  hasTransactions: boolean
}

export default class AccountEntity {
  id: number;
  name: string;
  icon?: string;  
  color?: string;
  balance?: number;
  countInAssets: boolean;
  isDefault: boolean;
  isShared: boolean;
  notes?: string;
  user?: IUser;
  sharedUsers?: IUser[];
  hasTransactions: boolean;

  constructor(model: IAccount) {
    this.id = model.id;
    this.name = model.name;
    this.icon = model.icon ?? undefined;
    this.color = model.color ?? '#006CD1';
    this.balance = model.balance ?? undefined;
    this.countInAssets = model.countInAssets ?? false;
    this.isDefault = model.isDefault;
    this.isShared = model.isShared;
    this.notes = model.notes ?? undefined;
    this.user = model.user ?? undefined;
    this.sharedUsers = model.sharedUsers ?? [];
    this.hasTransactions = model.hasTransactions;

  }

  getCurrentValuesAsJSON(): IAccount {
    return Object.assign({}, this);
  }

  static mock(overrides: Partial<IAccount> = {}): AccountEntity {
    return new AccountEntity({
      id: 1,
      name: 'Test Channel',
      icon: 'test@test.com',
      color: '#006CD1',
      balance: 12.0,
      countInAssets: false,
      isDefault: false,
      isShared: false,
      notes: 'Sample note',
      user: {
        id: 1,
        username: 'JohnDoe23',
        firstName: 'John',
        lastName: 'Doe',
      },
      sharedUsers: [],
      hasTransactions: false,
      ...overrides
    });
  }
}

