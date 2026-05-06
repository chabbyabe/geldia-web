import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'

export interface IRequestEmailVerificationDataGateway {
  requestEmailVerification: () => Promise<any>
}

export default class RequestEmailVerificationUseCase {
  constructor(
    private readonly dataGateway: IRequestEmailVerificationDataGateway
  ) {
  }

  async execute() {
    try {
      return await this.dataGateway.requestEmailVerification()
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }
}
