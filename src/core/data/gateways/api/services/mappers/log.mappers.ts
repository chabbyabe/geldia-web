import { IAccountLogModel, IPagedAPIViewModel, ITransactionLogModel } from "@data/gateways/api/api.types"
import { objectToCamel } from "ts-case-convert"
import { IPagedAccountLogEntity } from "@domain/entities/log/paged-account-log.entity"
import { IAccountLog } from "@domain/entities/log/account-log.entity"
import { IPagedTransactionLogEntity } from "@domain/entities/log/paged-transaction-log.entity"
import { ITransactionLog } from "@domain/entities/log/transaction-log.entity"

export const mapPagedTransactionLogAttributes = (
  response: IPagedAPIViewModel<ITransactionLogModel>
): IPagedTransactionLogEntity => {
  return {
    count: response.count,
    totalPages: response.total_pages,
    currentPageNumber: response.current_page_number,
    next: response.next,
    previous: response.previous,
    results: objectToCamel(response.results) as ITransactionLog[]
  }
}

export const mapPagedAccountLogAttributes = (
  response: IPagedAPIViewModel<IAccountLogModel>
): IPagedAccountLogEntity => {
  return {
    count: response.count,
    totalPages: response.total_pages,
    currentPageNumber: response.current_page_number,
    next: response.next,
    previous: response.previous,
    results: objectToCamel(response.results) as IAccountLog[]
  }
}
