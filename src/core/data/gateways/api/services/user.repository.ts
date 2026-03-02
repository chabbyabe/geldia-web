import { store } from "@interface/presenters/store/store";
import { retrieveAllUsers } from "@interface/presenters/store/reducers/users.reducer"
import { IUser } from "@base/core/domain/entities/user/user.entity";

export default class UserRepository {
  retrieveAllUsers(users: IUser[]) {
    store.dispatch(retrieveAllUsers(users))
  }

}