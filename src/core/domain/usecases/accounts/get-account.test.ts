import { mockAPIResponses } from '@data/infra/api-mock'
import AccountApiGateway from '@data/gateways/api/services/account.gateway'
import AccountRepository from '@data/gateways/api/services/account.repository'
import GetUserAccountUseCase from './get-account.usecase'
import RetrieveUsersUseCase from './retrieve-accounts.usecase'
import { BadRequest } from '@data/infra/api.error'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentAccount,
  initializeAccounts,
} from '@interface/presenters/store/reducers/accounts.reducer'
import { createMockAccount } from '@core/test/mocks/account.mock'

describe('Test GetUserAccountUseCase', () => {
  let gateway: AccountApiGateway
  let repo: AccountRepository
  let useCase: GetUserAccountUseCase

  let accountData = {
    accountId: 52,
    accountForm: createMockAccount({id:52})
  }
  
  beforeEach(() => {
    gateway = new AccountApiGateway()
    repo = new AccountRepository()
    useCase = new GetUserAccountUseCase(gateway, repo)

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
    await useCase.execute(52)

    const current = store.getState().accountState.currentAccount
    expect(current?.id).toBe(52)
    expect(current?.name).toBe(accountData.accountForm.name)
    expect(current?.balance).toBe(accountData.accountForm.balance)
    expect(current?.icon).toBe(accountData.accountForm.icon)
    expect(current?.color).toBe(accountData.accountForm.color)
    expect(current?.countInAssets).toBe(accountData.accountForm.countInAssets)
    expect(current?.isDefault).toBe(accountData.accountForm.isDefault)
    expect(current?.isShared).toBe(accountData.accountForm.isShared)
    expect(current?.notes).toBe(accountData.accountForm.notes)
    expect(current?.user).toBe(accountData.accountForm.user)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(52)).rejects.toThrow(BadRequest)
    await expect(useCase.execute(52)).rejects.toThrow('bad-request')
  })
})
