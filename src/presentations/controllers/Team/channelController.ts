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
      new UserRepository(),
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

  update(params: { teamId?: string; channelId?: string }, body: { name?: string }) {
    if (params.teamId === undefined || params.channelId === undefined || body.name === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.update(params.channelId, body.name);
  }

  invite(params: { teamId?: string; channelId?: string }, body: { userId?: string }) {
    if (
      params.teamId === undefined ||
      params.channelId === undefined ||
      body.userId === undefined
    ) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.inviteUser(params.channelId, body.userId);
  }

  removeUser(params: { teamId?: string; channelId?: string }, body: { userId?: string }) {
    if (
      params.teamId === undefined ||
      params.channelId === undefined ||
      body.userId === undefined
    ) {
      throw new PresentationError("リクエストが正しくありません");
    }

    return this.useCase.removeUser(params.channelId, body.userId);
  }
}
