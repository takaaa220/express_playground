import { UserRepository } from "../../../infrastructures/domains/User/userRepository";
import { CreateTeamForm } from "../../forms/Team/create";
import { TeamUseCase } from "../../../usecases/Team/TeamUseCase";
import { TeamRepository } from "../../../infrastructures/domains/Team/teamRepository";
import { SessionRepository } from "../../../infrastructures/usecases/Session/sessionRepository";

import { PresentationError } from "../../helpers/error";

export class TeamController {
  private useCase: TeamUseCase;

  constructor() {
    const userRepository = new UserRepository();
    this.useCase = new TeamUseCase(
      new TeamRepository(),
      userRepository,
      new SessionRepository(userRepository),
    );
  }

  async getAll() {
    const teams = await this.useCase.getAllTeams();
    return { teams };
  }

  async create(requestBody: {}) {
    const form = new CreateTeamForm(requestBody);

    const team = await this.useCase.createTeam(form.name, form.ownerName);
    return { team };
  }

  async inviteUser(params: { teamId?: string }, requestBody: { name?: string }) {
    if (params.teamId === undefined || requestBody.name === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const team = await this.useCase.inviteUser(params.teamId, requestBody.name);
    return { team };
  }

  async changeOwner(params: { teamId?: string; newOwnerId?: string }) {
    if (params.teamId === undefined || params.newOwnerId === undefined) {
      throw new PresentationError("りくえすとがただしくありません");
    }

    const team = await this.useCase.changeOwner(params.teamId, params.newOwnerId);
    return { team };
  }

  async delete(params: { teamId?: string }) {
    if (params.teamId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    await this.useCase.delete(params.teamId);
    return;
  }
}
