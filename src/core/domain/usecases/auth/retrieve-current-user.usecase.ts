import { IAuthState } from '@domain/entities/auth/auth.entity'

export interface IRetrieveCurrentUserDataGateway {
  retrieveCurrentUser: () => Promise<any>
}

export interface IRetrieveCurrentUserDataRepository {
  setUser: (newUser: IAuthState) => void
  clearUser: () => void
  setInitialized: (isInitialized: boolean) => void
}

export default class RetrieveCurrentUserUseCase {
  constructor(
    private readonly dataGateway: IRetrieveCurrentUserDataGateway,
    private readonly dataRepository: IRetrieveCurrentUserDataRepository
  ) {
  }

  async execute() {
    try {
      const response = await this.dataGateway.retrieveCurrentUser()
      this.dataRepository.setUser({ user: response, initialized: true })
      return response
    } catch (error) {
      this.dataRepository.clearUser()
      throw error
    } finally {
      this.dataRepository.setInitialized(true)
    }
  }
}
