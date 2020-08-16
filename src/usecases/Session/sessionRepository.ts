import { User } from "../../domains/User/user";

export interface ISessionRepository {
  getId(): Promise<User["id"] | undefined>;
  isSystemOwner(): Promise<boolean>;
}
