import { User } from "./user";
import { Team } from "../Team/team";

export interface IUserRepository {
  getAllByTeamId(teamId: Team["id"]): Promise<User[]>;
  get(userId: User["id"]): Promise<User>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
}
