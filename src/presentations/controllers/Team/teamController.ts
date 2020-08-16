import { UserRepository } from "../../../infrastructures/domains/User/userRepository";
import { CreateTeamForm } from "../../forms/Team/create";
import { TeamUseCase } from "../../../usecases/Team/TeamUseCase";
import { TeamRepository } from "../../../infrastructures/domains/Team/teamRepository";
import { SessionRepository } from "../../../infrastructures/usecases/Session/sessionRepository";

import { PresentationError } from "../../helpers/error";

export class TeamController {
  private useCase: TeamUseCase;

  constructor() {
    this.useCase = new TeamUseCase(
      new TeamRepository(),
      new UserRepository(),
      new SessionRepository(),
    );
  }

  async getAll() {
    return this.useCase.getAllTeams();
  }

  async create(requestBody: {}) {
    const form = new CreateTeamForm(requestBody);

    return this.useCase.createTeam(form.name, form.ownerName);
  }

  async inviteUser(params: { teamId?: string }, requestBody: { name?: string }) {
    if (params.teamId === undefined || requestBody.name === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.inviteUser(params.teamId, requestBody.name);
  }

  async changeOwner(params: { teamId?: string; newOwnerId?: string }) {
    if (params.teamId === undefined || params.newOwnerId === undefined) {
      throw new PresentationError("りくえすとがただしくありません");
    }

    return this.useCase.changeOwner(params.teamId, params.newOwnerId);
  }

  async delete(params: { teamId?: string }) {
    if (params.teamId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.delete(params.teamId);
  }
}
