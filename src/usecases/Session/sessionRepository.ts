import { User } from "../../domains/User/user";

export interface ISessionRepository {
  getUser(): Promise<User | undefined>;
  isSystemOwner(): Promise<boolean>;
}
