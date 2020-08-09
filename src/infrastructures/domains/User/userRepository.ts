import { User } from "../../../domains/User/user";
import { IUserRepository } from "../../../domains/User/userRepository";

const users: User[] = [];

export class UserRepository implements IUserRepository {
  async create(user: User) {
    return new Promise<User>((resolve) => {
      users.push(user);

      resolve(user);
    });
  }
}
