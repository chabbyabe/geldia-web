import { mockAPIResponses } from '@data/infra/api-mock'
import AccountApiGateway from '@data/gateways/api/services/account.gateway'
import AccountRepository from '@data/gateways/api/services/account.repository'
import DeleteAccountUseCase from './delete-account.usecase'
import GetUserAccountUseCase from './get-account.usecase'
import RetrieveUsersUseCase from './retrieve-accounts.usecase'
import { BadRequest } from '@data/infra/api.error'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentAccount,
  initializeAccounts,
} from '@interface/presenters/store/reducers/accounts.reducer'
import { createMockAccount } from '@core/test/mocks/account.mock'

describe('Test DeleteAccountUseCase', () => {
  let gateway: AccountApiGateway
  let repo: AccountRepository
  let useCase: DeleteAccountUseCase

  let accountData = {
    accountId: 71,
    accountForm: createMockAccount({id:71})
  }

  beforeEach(() => {
    gateway = new AccountApiGateway()
    repo = new AccountRepository()
    useCase = new DeleteAccountUseCase(gateway, repo)

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
    await new GetUserAccountUseCase(gateway, repo).execute(71)

    const account = store.getState().accountState.currentAccount
    expect(account?.id).toBe(71)

    await useCase.execute(account!)

    const deleted = store.getState().accountState.accounts.find((item) => item.id === 71)
    expect(deleted).toBeUndefined()
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(
      useCase.execute(accountData.accountForm),
    ).rejects.toThrow(BadRequest)
  })
})
