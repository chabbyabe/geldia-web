import { ICompany } from "@domain/entities/company/company.entity";

export interface IUser {
  id: number
  username: string
  email?: string
  emailVerified?: boolean
  firstName: string
  lastName: string
  company?: ICompany | null
}

export default class UserEntity {
  id: number;
  username: string;
  email?: string;
  emailVerified?: boolean;
  firstName: string;
  lastName: string;
  company?: ICompany | null;

  constructor(model: IUser) {
    this.id = model.id;
    this.username = model.username;
    this.email = model.email ?? undefined;
    this.emailVerified = model.emailVerified ?? false;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.company = model.company ?? null;
  }

  getCurrentValuesAsJSON(): IUser {
    return Object.assign({}, this);
  }

  static mock(username: string = 'Test Channel', email: string = 'test@test.com', firstName: string = 'First Name', lastName: string = 'Last Name'): UserEntity {
    const channel = new UserEntity({
      'id': 1,
      'username': username,
      'email': email,
      'emailVerified': true,
      'firstName': firstName,
      'lastName': lastName,
      'company': null,
    })
    return channel
  }
}
