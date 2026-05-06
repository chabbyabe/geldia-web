/**
 * Contains all the interfaces for the API Error responses
 */

export interface IBaseAPIErrorModel {
  non_field_errors?: string[];
}

export interface IUserLoginErrorModel extends IBaseAPIErrorModel {
  username?: string[];
  email?: string[];
  company?: string[];
  token?: string[];
  first_name?: string[];
  last_name?: string[];
  password_1?: string[];
  password_2?: string[];
}

export interface IUserPasswordChangeErrorModel extends IBaseAPIErrorModel {
  new_password1?: string[];
  new_password2?: string[];
}
