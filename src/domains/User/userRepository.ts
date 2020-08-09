import { User } from "./user";

export interface IUserRepository {
  create(user: User): Promise<User>;
}
