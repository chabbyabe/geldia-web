import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { IFormEmailVerification } from '@domain/entities/formModels/settings-form.entity'

export interface IConfirmEmailVerificationDataGateway {
  confirmEmailVerification: (data: IFormEmailVerification) => Promise<any>
}

export default class ConfirmEmailVerificationUseCase {
  constructor(
    private readonly dataGateway: IConfirmEmailVerificationDataGateway
  ) {
  }

  async execute(data: IFormEmailVerification) {
    try {
      return await this.dataGateway.confirmEmailVerification(data)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }
}
