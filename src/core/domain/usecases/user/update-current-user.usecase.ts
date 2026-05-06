import { IAuthState } from '@domain/entities/auth/auth.entity'
import { IFormPersonalInformation } from '@domain/entities/formModels/settings-form.entity'
import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'

export interface IUpdateCurrentUserDataGateway {
  updateCurrentUser: (user: IFormPersonalInformation) => Promise<any>
}

export interface IUpdateCurrentUserDataRepository {
  setUser: (newUser: IAuthState) => void
}

export default class UpdateCurrentUserUseCase {
  constructor(
    private readonly dataGateway: IUpdateCurrentUserDataGateway,
    private readonly dataRepository: IUpdateCurrentUserDataRepository
  ) {
  }

  async execute(userData: IFormPersonalInformation) {
    try {
      const response = await this.dataGateway.updateCurrentUser(userData)
      this.dataRepository.setUser({ user: response, initialized: true })
      return response
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }
}
