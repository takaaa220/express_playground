import { UserRepository } from "../../../infrastructures/domains/User/userRepository";
import { CreateTeamForm } from "../../forms/createTeamForm";
import { TeamUseCase } from "../../../usecases/Team/TeamUseCase";
import { TeamRepository } from "../../../infrastructures/domains/Team/teamRepository";

export class TeamController {
  private useCase: TeamUseCase;

  constructor() {
    this.useCase = new TeamUseCase(new TeamRepository(), new UserRepository());
  }

  async create(requestBody: {}) {
    const form = new CreateTeamForm(requestBody);

    return this.useCase.createTeam(form.name, form.ownerName);
  }
}
