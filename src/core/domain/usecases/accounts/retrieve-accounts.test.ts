import { mockAPIResponses } from '@data/infra/api-mock'
import AccountApiGateway from '@data/gateways/api/services/account.gateway'
import AccountRepository from '@data/gateways/api/services/account.repository'
import RetrieveUsersUseCase from './retrieve-accounts.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import { initializeAccounts } from '@interface/presenters/store/reducers/accounts.reducer'
import { createMockAccount } from '@core/test/mocks/account.mock'

describe('Test RetrieveAccountsUseCase', () => {
  let gateway: AccountApiGateway
  let repo: AccountRepository
  let useCase: RetrieveUsersUseCase

  let accountData = {
    accountId: 41,
    accountForm: createMockAccount({id:41})
  }

  beforeEach(() => {
    gateway = new AccountApiGateway()
    repo = new AccountRepository()
    useCase = new RetrieveUsersUseCase(gateway, repo)

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
  })

  test('Execute without errors', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, false, accountData)

    await useCase.execute(false, 1)

    const accounts = store.getState().accountState.accounts
    expect(accounts.length).toBe(1)
    expect(accounts[0].name).toBe(accountData.accountForm.name);
    expect(accounts[0].balance).toBe(accountData.accountForm.balance);
    expect(accounts[0].id).toBe(41)
  })

  test('Execute with error', async () => {
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, { errorMessage: 'failed' })

    await expect(useCase.execute(false, 1)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(false, 1)).rejects.toThrow('bad-request')
  })
})
