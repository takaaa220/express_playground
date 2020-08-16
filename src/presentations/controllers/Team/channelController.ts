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

  async getAll(params: { teamId?: string }) {
    if (params.teamId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channels = await this.useCase.getAll(params.teamId);
    return { channels };
  }

  async create(params: { teamId?: string }, body: { channelName?: string; isPrivate?: boolean }) {
    if (
      params.teamId === undefined ||
      body.channelName === undefined ||
      body.isPrivate === undefined
    ) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channel = await this.useCase.create(params.teamId, {
      channelName: body.channelName,
      isPrivate: body.isPrivate,
    });
    return { channel };
  }

  async update(params: { teamId?: string; channelId?: string }, body: { name?: string }) {
    if (params.teamId === undefined || params.channelId === undefined || body.name === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channel = await this.useCase.update(params.channelId, body.name);
    return { channel };
  }

  async delete(params: { teamId?: string; channelId?: string }) {
    if (params.teamId === undefined || params.channelId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    await this.useCase.delete(params.channelId);
    return;
  }

  async join(params: { teamId?: string; channelId?: string }) {
    if (params.teamId === undefined || params.channelId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channel = await this.useCase.join(params.channelId);
    return { channel };
  }

  async leave(params: { teamId?: string; channelId?: string }) {
    if (params.teamId === undefined || params.channelId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channel = await this.useCase.leave(params.channelId);
    return { channel };
  }

  async invite(params: { teamId?: string; channelId?: string }, body: { userId?: string }) {
    if (
      params.teamId === undefined ||
      params.channelId === undefined ||
      body.userId === undefined
    ) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channel = await this.useCase.inviteUser(params.channelId, body.userId);
    return { channel };
  }

  async removeUser(params: { teamId?: string; channelId?: string }, body: { userId?: string }) {
    if (
      params.teamId === undefined ||
      params.channelId === undefined ||
      body.userId === undefined
    ) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const channel = await this.useCase.removeUser(params.channelId, body.userId);
    return { channel };
  }
}
