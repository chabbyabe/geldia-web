import { mockAPIResponses } from '@data/infra/api-mock'
import AccountApiGateway from '@data/gateways/api/services/account.gateway'
import AccountRepository from '@data/gateways/api/services/account.repository'
import UpdateAccountUseCase from './update-account.usecase'
import RetrieveUsersUseCase from './retrieve-accounts.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentAccount,
  initializeAccounts,
} from '@interface/presenters/store/reducers/accounts.reducer'
import { createMockAccount } from '@core/test/mocks/account.mock'

describe('Test UpdateAccountUseCase', () => {
  let gateway: AccountApiGateway
  let repo: AccountRepository
  let useCase: UpdateAccountUseCase

  let accountData = {
    accountId: 61,
    accountForm: createMockAccount({id:61})
  }

  beforeEach(() => {
    gateway = new AccountApiGateway()
    repo = new AccountRepository()
    useCase = new UpdateAccountUseCase(gateway, repo)

    store.dispatch(
      initializeAccounts({
        results: [],
        next: null,
        previous: null,
        count: 0,
        totalPages: 1,
        currentPageNumber: 1,
      }),
    )
    store.dispatch(clearCurrentAccount())
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, accountData)

    await new RetrieveUsersUseCase(gateway, repo).execute(false, 1)
    await useCase.execute(61, accountData.accountForm)

    const updated = store.getState().accountState.accounts.find((item) => item.id === 61)
    expect(updated?.name).toBe(accountData.accountForm.name)
    expect(updated?.balance).toBe(accountData.accountForm.balance)
    expect(updated?.icon).toBe(accountData.accountForm.icon)
    expect(updated?.color).toBe(accountData.accountForm.color)
    expect(updated?.countInAssets).toBe(accountData.accountForm.countInAssets)
    expect(updated?.isDefault).toBe(accountData.accountForm.isDefault)
    expect(updated?.isShared).toBe(accountData.accountForm.isShared)
    expect(updated?.notes).toBe(accountData.accountForm.notes)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(61, accountData.accountForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(61, accountData.accountForm)).rejects.toThrow('bad-request')
  })
})
