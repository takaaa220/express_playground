import { ISessionRepository } from "../Session/sessionRepository";
import { IMessageRepository } from "../../domains/Message/messageRepository";
import { IChannelRepository } from "../../domains/Channel/channelRepository";

import { Message } from "../../domains/Message/message";
import { UseCaseError } from "../helpers/error";

export class MessageUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private messageRepository: IMessageRepository,
    private channelRepository: IChannelRepository,
  ) {}

  async getAll(channelId: string): Promise<Message[]> {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) throw new UseCaseError("チャンネルが見つかりませんでした");

    if (!channel.hasMessageViewingAuthority(currentUser)) {
      throw new UseCaseError("メッセージの閲覧権限がありません");
    }

    return this.messageRepository.getAll(channelId);
  }

  async create(channelId: string, content: string): Promise<Message> {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) throw new UseCaseError("チャンネルが見つかりませんでした");

    const message = channel.createMessage(currentUser, content);
    await this.messageRepository.create(message);

    return message;
  }
}
