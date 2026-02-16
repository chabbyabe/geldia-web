import { IUser } from "@domain/entities/user/user.entity"


export interface IRetrieveAllUsersDataGateway {
  retrieveAllUsers: () => Promise<any>
}

export interface IRetrieveAllUsersDataRepository {
  retrieveAllUsers: (users: IUser[]) => void   
}

export default class RetrieveAccountUseCase {
  constructor(
    private readonly dataGateway: IRetrieveAllUsersDataGateway,
    private readonly dataRepository: IRetrieveAllUsersDataRepository,
  ) {
  }
  async execute() {
    const user =  await this.dataGateway.retrieveAllUsers();
    await this.dataRepository.retrieveAllUsers(user);
  }
}