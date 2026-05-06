export interface IFormSignUp {
  firstName: string
  lastName: string
  username: string
  email: string
  password1: string
  password2: string
}

export interface IFormSignUpError {
  nonFieldErrors?: string[]
  firstName?: string[]
  lastName?: string[]
  username?: string[]
  email?: string[]
  company?: string[]
  password1?: string[]
  password2?: string[]
}

export interface IFormLogin {
  username: string
  password: string
}
