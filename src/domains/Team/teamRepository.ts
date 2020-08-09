import { Team } from "./team";

export interface ITeamRepository {
  get(teamId: Team["id"]): Promise<Team>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
}
