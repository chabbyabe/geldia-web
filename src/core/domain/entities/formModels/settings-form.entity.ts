export interface IFormPersonalInformation {
  firstName: string
  lastName: string
  username: string
  email: string
  companyId: number | null
}

export interface IFormPersonalInformationError {
  nonFieldErrors?: string[]
}

export interface IFormPasswordReset {
  newPassword1: string
  newPassword2: string
}

export interface IFormPasswordResetError {
  nonFieldErrors?: string[]
  newPassword1?: string[]
  newPassword2?: string[]
}

export interface IFormEmailVerification {
  token: string
}

export interface IFormEmailVerificationError {
  nonFieldErrors?: string[]
  token?: string[]
  email?: string[]
}
