import { ITeamRepository } from "../../domains/Team/teamRepository";
import { IUserRepository } from "../../domains/User/userRepository";
import { User } from "../../domains/User/user";
import { createId } from "../../helpers/createId";
import { Team } from "../../domains/Team/team";
import { ISessionRepository } from "../Session/sessionRepository";
import { UseCaseError } from "../helpers/error";

export class TeamUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository,
  ) {}

  async createTeam(name: string, ownerName: string) {
    const ownerId = createId();
    const teamId = createId();

    const owner = new User(ownerId, ownerName, "Owner", teamId);
    await this.userRepository.create(owner);

    const team = new Team(teamId, name, owner.id, [owner.id]);
    return this.teamRepository.create(team);
  }

  async inviteUser(teamId: string, targetUserName: string) {
    const currentUserId = await this.sessionRepository.getId();
    if (!currentUserId) throw new UseCaseError("ログインしてください");
    const currentUser = await this.userRepository.get(currentUserId);

    const target = new User(createId(), targetUserName, "Member", teamId);

    const team = await this.teamRepository.get(teamId);
    team.invite(currentUser, target);

    return this.teamRepository.update(team);
  }
}