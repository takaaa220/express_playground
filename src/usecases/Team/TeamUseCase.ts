import { ITeamRepository } from "../../domains/Team/teamRepository";
import { IUserRepository } from "../../domains/User/userRepository";
import { User } from "../../domains/User/user";
import { createId } from "../../helpers/createId";
import { Team } from "../../domains/Team/team";

export class TeamUseCase {
  constructor(private teamRepository: ITeamRepository, private userRepository: IUserRepository) {}

  async createTeam(name: string, ownerName: string) {
    const ownerId = createId();
    const owner = new User(ownerId, ownerName, "Owner");
    await this.userRepository.create(owner);

    const teamId = createId();
    const team = new Team(teamId, name, owner);

    return this.teamRepository.create(team);
  }
}
