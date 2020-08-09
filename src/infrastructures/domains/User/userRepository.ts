import { User } from "../../../domains/User/user";
import { IUserRepository } from "../../../domains/User/userRepository";
import { InfrastructureError } from "../../helpers/error";

const users: User[] = [new User("current", "takaaa220", "Owner", "team1")];

export class UserRepository implements IUserRepository {
  async get(userId: User["id"]) {
    return new Promise<User>((resolve, reject) => {
      const user = users.find((u) => u.id === userId);

      if (!user) reject(new InfrastructureError("Not Found"));

      resolve(user);
    });
  }

  async create(user: User) {
    return new Promise<User>((resolve) => {
      users.push(user);

      resolve(user);
    });
  }
}
