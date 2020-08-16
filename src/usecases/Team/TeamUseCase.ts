import { ITeamRepository } from "../../domains/Team/teamRepository";
import { IUserRepository } from "../../domains/User/userRepository";
import { User } from "../../domains/User/user";
import { createId } from "../../helpers/createId";
import { Team } from "../../domains/Team/team";
import { ISessionRepository } from "../Session/sessionRepository";
import { UseCaseError } from "../helpers/error";
import { IChannelRepository } from "../../domains/Channel/channelRepository";

export class TeamUseCase {
  constructor(
    private teamRepository: ITeamRepository,
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository,
    private channelRepository: IChannelRepository,
  ) {}

  async getAllTeams() {
    // システムの管理者権限を持つユーザしか操作することができないようにする
    const isSystemOwner = await this.sessionRepository.isSystemOwner();

    if (!isSystemOwner) {
      throw new UseCaseError("システム管理者のみリクエストすることができます");
    }

    return this.teamRepository.getAll({});
  }

  async createTeam(name: string, ownerName: string) {
    const ownerId = createId();
    const teamId = createId();

    const owner = new User(ownerId, ownerName, "Owner", teamId, false);
    await this.userRepository.create(owner);

    const team = new Team(teamId, name, owner.id, [owner.id]);
    return this.teamRepository.create(team);
  }

  async inviteUser(teamId: string, targetUserName: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const target = new User(createId(), targetUserName, "Member", teamId, false);
    await this.userRepository.create(target);

    const team = await this.teamRepository.get(teamId);
    team.invite(currentUser, target);

    return this.teamRepository.update(team);
  }

  async changeOwner(teamId: string, newOwnerId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const newOwner = await this.userRepository.get(newOwnerId);

    const team = await this.teamRepository.get(teamId);

    team.changeOwner(currentUser, newOwner);
    currentUser.downgradeToAdmin(team);
    newOwner.upgradeToOwner(team);

    return this.teamRepository.update(team);
  }

  async update(teamId: string, attributes: { name: string }) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const team = await this.teamRepository.get(teamId);
    team.updateAttributes(currentUser, { name: attributes.name });

    return this.teamRepository.update(team);
  }

  async delete(teamId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const team = await this.teamRepository.get(teamId);
    team.deleteTeam(currentUser);

    await this.teamRepository.delete(team);
  }

  async removeUser(teamId: string, userId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const target = await this.userRepository.get(userId);
    target.delete();

    const team = await this.teamRepository.get(teamId);
    team.removeUser(currentUser, target);

    const channels = await this.channelRepository.getAllByUserId(teamId, userId);
    channels.forEach((channel) => channel.removeUser(currentUser, target));

    await Promise.all([
      this.teamRepository.update(team),
      this.channelRepository.updateAll(channels),
      this.userRepository.delete(target),
    ]);

    return team;
  }
}
