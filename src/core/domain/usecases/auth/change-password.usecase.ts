import { BadRequest } from '@data/infra/api.error'
import { FormRequestError } from '@domain/entities/formModels/errors.entity'
import { IFormPasswordReset } from '@domain/entities/formModels/settings-form.entity'

export interface IChangePasswordDataGateway {
  changePassword: (passwordData: IFormPasswordReset) => Promise<void>
}

export default class ChangePasswordUseCase {
  constructor(
    private readonly dataGateway: IChangePasswordDataGateway
  ) {
  }

  async execute(passwordData: IFormPasswordReset) {
    try {
      return await this.dataGateway.changePassword(passwordData)
    } catch (error) {
      if (error instanceof BadRequest) {
        throw new FormRequestError(error.message, error.data)
      }
      throw error
    }
  }
}
