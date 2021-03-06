import { UserRepository } from "../../../infrastructures/domains/User/userRepository";
import { CreateTeamForm } from "../../forms/Team/create";
import { TeamUseCase } from "../../../usecases/Team/TeamUseCase";
import { TeamRepository } from "../../../infrastructures/domains/Team/teamRepository";
import { SessionRepository } from "../../../infrastructures/usecases/Session/sessionRepository";

import { PresentationError } from "../../helpers/error";
import { ChannelRepository } from "../../../infrastructures/domains/Channel/channelRepository";
import { Team } from "../../../domains/Team/team";

export class TeamController {
  private useCase: TeamUseCase;

  constructor() {
    const userRepository = new UserRepository();
    this.useCase = new TeamUseCase(
      new TeamRepository(),
      userRepository,
      new SessionRepository(userRepository),
      new ChannelRepository(),
    );
  }

  async getAll() {
    const teams = await this.useCase.getAllTeams();
    return { teams: teams.map((t) => this.serialize(t)) };
  }

  async create(body: {}) {
    const form = new CreateTeamForm(body);

    const team = await this.useCase.createTeam(form.name, form.ownerName);
    return { team: this.serialize(team) };
  }

  async update(params: { teamId?: string }, body: { name?: string }) {
    if (params.teamId === undefined || body.name === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const team = await this.useCase.update(params.teamId, { name: body.name });
    return { team: this.serialize(team) };
  }

  async inviteUser(params: { teamId?: string }, body: { name?: string }) {
    if (params.teamId === undefined || body.name === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const team = await this.useCase.inviteUser(params.teamId, body.name);
    return { team: this.serialize(team) };
  }

  async changeOwner(params: { teamId?: string; newOwnerId?: string }) {
    if (params.teamId === undefined || params.newOwnerId === undefined) {
      throw new PresentationError("りくえすとがただしくありません");
    }

    const team = await this.useCase.changeOwner(params.teamId, params.newOwnerId);
    return { team: this.serialize(team) };
  }

  async delete(params: { teamId?: string }) {
    if (params.teamId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    await this.useCase.delete(params.teamId);
  }

  async removeUser(params: { teamId?: string }, body: { userId: string }) {
    if (params.teamId === undefined || body.userId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const team = await this.useCase.removeUser(params.teamId, body.userId);
    return this.serialize(team);
  }

  private serialize(team: Team) {
    return {
      id: team.id,
      name: team.name,
      deleted: team.deleted,
      ownerId: team.ownerId,
      userIds: team.userIds,
    };
  }
}
