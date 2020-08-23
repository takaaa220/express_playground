import { MessageUseCase } from "../../../usecases/Message/MessageUseCase";
import { SessionRepository } from "../../../infrastructures/usecases/Session/sessionRepository";
import { MessageRepository } from "../../../infrastructures/domains/Message/messageRepository";
import { ChannelRepository } from "../../../infrastructures/domains/Channel/channelRepository";
import { UserRepository } from "../../../infrastructures/domains/User/userRepository";
import { PresentationError } from "../../helpers/error";
import { Message } from "../../../domains/Message/message";

export class MessageController {
  private useCase: MessageUseCase;

  constructor() {
    this.useCase = new MessageUseCase(
      new SessionRepository(new UserRepository()),
      new MessageRepository(),
      new ChannelRepository(),
    );
  }

  async getAll(params: { teamId?: string; channelId?: string }) {
    if (params.teamId === undefined || params.channelId === undefined) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const messages = await this.useCase.getAll(params.channelId);
    return { messages: messages.map((m) => this.serialize(m)) };
  }

  async create(params: { teamId?: string; channelId?: string }, body: { message?: string }) {
    if (
      params.teamId === undefined ||
      params.channelId === undefined ||
      body.message === undefined
    ) {
      throw new PresentationError("リクエストが正しくありません");
    }

    const message = await this.useCase.create(params.channelId, body.message);
    return { message: this.serialize(message) };
  }

  private serialize(message: Message) {
    return {
      id: message.id,
      content: message.content,
      userId: message.userId,
    };
  }
}
