import { mockAPIResponses } from '@data/infra/api-mock'
import AccountApiGateway from '@data/gateways/api/services/account.gateway'
import AccountRepository from '@data/gateways/api/services/account.repository'
import CreateAccountUseCase from './create-account.usecase'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { store } from '@interface/presenters/store/store'
import {
  clearCurrentAccount,
  initializeAccounts,
} from '@interface/presenters/store/reducers/accounts.reducer'
import { createMockAccount } from '@core/test/mocks/account.mock'

describe('Test CreateAccountUseCase', () => {
  let gateway: AccountApiGateway
  let repo: AccountRepository
  let useCase: CreateAccountUseCase

  let accountData = {
    accountId: 31,
    accountForm: createMockAccount({id:31})
  }
  
  beforeEach(() => {
    gateway = new AccountApiGateway()
    repo = new AccountRepository()
    useCase = new CreateAccountUseCase(gateway, repo)

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

    await useCase.execute(accountData.accountForm)

    const account = store.getState().accountState.accounts.find((item) => item.id === 31)
    expect(account?.name).toBe(accountData.accountForm.name)
    expect(account?.icon).toBe(accountData.accountForm.icon)
    expect(account?.color).toBe(accountData.accountForm.color)
    expect(account?.isDefault).toBe(accountData.accountForm.isDefault)
    expect(account?.isShared).toBe(accountData.accountForm.isShared)
    expect(account?.notes).toBe(accountData.accountForm.notes)
    expect(account?.countInAssets).toBe(accountData.accountForm.countInAssets)
    expect(account?.balance).toBe(accountData.accountForm.balance)
  })

  test('Execute with errors you already have a default account', async () => {
    const simulatedError = 'You already have a default account.'
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(accountData.accountForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(accountData.accountForm)).rejects.toThrow('bad-request')
    expect(store.getState().accountState.accounts).toEqual([])
  })

  test('Execute with errors account not exists', async () => {
    const simulatedError = 'Account does not exist.'
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(accountData.accountForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(accountData.accountForm)).rejects.toThrow('bad-request')
    expect(store.getState().accountState.accounts).toEqual([])
  })

  test('Execute with error', async () => {
    const simulatedError = "failed"
    mockAPIResponses(gateway.apiSauce.axiosInstance, true, simulatedError)

    await expect(useCase.execute(accountData.accountForm)).rejects.toThrow(FormRequestError)
    await expect(useCase.execute(accountData.accountForm)).rejects.toThrow('bad-request')
  })
})
