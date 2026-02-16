import { IAccount } from '@domain/entities/account/account.entity';
import { IAccountModel, IPagedAPIViewModel, IUserModel } from '@data/gateways/api/api.types'
import { mapUserAttributes } from '@data/gateways/api/services/mappers/user.mappers';
import { IUser } from '@domain/entities/user/user.entity';
import { IPagedAccountEntity } from '@domain/entities/account/paged.account.entity';

export const mapAccountAttributes = (initialModel: IAccountModel) : IAccount => {
  return {
    id: initialModel.id,
    name: initialModel.name,
    icon: initialModel.icon,
    color: initialModel.color,
    balance: initialModel.balance,
    countInAssets: initialModel.count_in_assets,
    isDefault: initialModel.is_default,
    isShared: initialModel.is_shared,
    notes: initialModel.notes,
    user: mapUserAttributes(initialModel.user),
    sharedUsers: mapSharedUsers(initialModel.shared_users),
    hasTransactions: initialModel.has_transactions,
    createdAt: initialModel.created_at,
    updatedAt: initialModel.updated_at,
    deletedAt: initialModel.deleted_at ?? undefined,
  }
}

function mapSharedUsers(users: IUserModel[]) : IUser[] {
  return users.map(mapUserAttributes);
}

export const mapUserAccountAttributes = (initialModel: IPagedAPIViewModel<IAccountModel>): IPagedAccountEntity => {
    const accountList = initialModel.results.map((result: IAccountModel) => ({
        ...mapAccountAttributes(result)
    }));
  return {
    count: initialModel.count,
    next: initialModel.next,
    previous: initialModel.previous,
    results: accountList,
    totalPages: initialModel.total_pages,
    currentPageNumber: initialModel.current_page_number
  }
}