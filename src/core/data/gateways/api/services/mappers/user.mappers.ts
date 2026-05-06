import { IFormSignUpError } from '@domain/entities/formModels/signup-form.entity'
import { IUserLoginErrorModel } from '@data/gateways/api/api-error.types'
import { IUserModel } from '@data/gateways/api/api.types'
import { IUser } from '@base/core/domain/entities/user/user.entity'
import { mapCompanyAttributes } from './company.mappers'

export const mapUserAttributes = (initialModel: IUserModel) : IUser => {
  return {
    id: initialModel.id,
    email: initialModel.email,
    emailVerified: initialModel.email_verified ?? false,
    firstName: initialModel.first_name,
    lastName: initialModel.last_name,
    username: initialModel.username,
    company: initialModel.company ? mapCompanyAttributes(initialModel.company) : null
  }
}

export const mapUserLoginErrorAttributes = (initialModel: IUserLoginErrorModel): IFormSignUpError => {
  return {
    nonFieldErrors: initialModel.non_field_errors,
    firstName: initialModel.first_name,
    lastName: initialModel.last_name,
    email: initialModel.email,
    company: initialModel.company,
    username: initialModel.username,
    password1: initialModel.password_1,
    password2: initialModel.password_2
  }
}

export const mapUsersAttributes = (initialModel: IUserModel[]): IUser[] => {
    const users = initialModel.map((result: IUserModel) => ({
        ...mapUserAttributes(result)
    }));
  return users;
}
