import { Team } from "../../../domains/Team/team";
import { ITeamRepository } from "../../../domains/Team/teamRepository";
import { InfrastructureError } from "../../helpers/error";
import { UserRepository } from "../User/userRepository";

let teams: Team[] = [new Team("team1", "takaaa220 team", "current", ["current"])];

export class TeamRepository implements ITeamRepository {
  get(teamId: Team["id"]) {
    return new Promise<Team>(async (resolve, reject) => {
      const team = teams.find((t) => t.id === teamId);
      if (!team) {
        return reject(new InfrastructureError("Not Found"));
      }

      const teamIds = await this.teamUserIds(teamId);

      resolve(new Team(team.id, team.name.value, team.ownerId, teamIds));
    });
  }

  create(team: Team) {
    return new Promise<Team>((resolve) => {
      teams.push(team);

      resolve(team);
    });
  }

  update(team: Team) {
    return new Promise<Team>(async (resolve, reject) => {
      teams = teams.reduce((previouValue, currentValue) => {
        if (currentValue.id === team.id) {
          return [...previouValue, team];
        } else {
          return [...previouValue, currentValue];
        }
      }, [] as Team[]);

      resolve(team);
    });
  }

  private teamUserIds(teamId: Team["id"]) {
    return new Promise<Team["id"][]>((resolve) => {
      const team = teams.find((t) => t.id === teamId);

      resolve(team ? team.userIds : []);
    });
  }
}
