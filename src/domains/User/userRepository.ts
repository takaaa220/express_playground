import { User } from "./user";

export interface IUserRepository {
  get(userId: User["id"]): Promise<User>;
  create(user: User): Promise<User>;
}
