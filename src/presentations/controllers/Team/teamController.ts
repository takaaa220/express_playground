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
}
