import { User } from "domains/User/user";
import { Team } from "./team";

export interface ITeamRepository {
  create(team: Team): Promise<Team>;
}
