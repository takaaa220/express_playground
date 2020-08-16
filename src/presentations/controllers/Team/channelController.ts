import { UserRepository } from "../../../infrastructures/domains/User/userRepository";
import { TeamRepository } from "../../../infrastructures/domains/Team/teamRepository";
import { SessionRepository } from "../../../infrastructures/usecases/Session/sessionRepository";

import { PresentationError } from "../../helpers/error";
import { ChannelUseCase } from "../../../usecases/Channel/ChannelUseCase";
import { ChannelRepository } from "../../../infrastructures/domains/Channel/channelRepository";

export class ChannelController {
  private useCase: ChannelUseCase;

  constructor() {
    const userRepository = new UserRepository();
    this.useCase = new ChannelUseCase(
      new TeamRepository(),
      new SessionRepository(userRepository),
      new ChannelRepository(),
    );
  }

  getAll(params: { teamId?: string }) {
    if (params.teamId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.getAll(params.teamId);
  }

  create(params: { teamId?: string }, body: { channelName?: string }) {
    if (params.teamId === undefined || body.channelName === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.create(params.teamId, body.channelName);
  }
}
