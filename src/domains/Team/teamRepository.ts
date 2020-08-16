import { Team } from "./team";

export interface ITeamRepository {
  getAll(filter: { limit?: number }): Promise<Team[]>;
  get(teamId: Team["id"]): Promise<Team>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
}
