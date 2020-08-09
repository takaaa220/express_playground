import { Team } from "../../../domains/Team/team";
import { ITeamRepository } from "../../../domains/Team/teamRepository";

const teams = [];
export class TeamRepository implements ITeamRepository {
  create(team: Team) {
    return new Promise<Team>((resolve) => {
      teams.push(team);

      resolve(team);
    });
  }
}
