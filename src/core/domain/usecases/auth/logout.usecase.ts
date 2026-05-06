export interface IAuthLogoutDataGateway {
  logout: () => Promise<any>
}

export interface ILoginUserDataRepository {
  clearUser: () => void
}

export default class LogoutUserUseCase {
  constructor(
      private readonly dataGateway: IAuthLogoutDataGateway,
      private readonly dataRepository: ILoginUserDataRepository
  ) {
  }
  async execute() {
      try {
          return await this.dataGateway.logout()
      } finally {
          this.dataRepository.clearUser()
      }
  }
} 
