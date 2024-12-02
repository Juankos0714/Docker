import { IUser, IUserRegister } from '../types/user.types';


export class UserService {
  private users: IUser[] = [];

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create(userData: IUserRegister): Promise<IUser> {
    const newUser: IUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }
}
