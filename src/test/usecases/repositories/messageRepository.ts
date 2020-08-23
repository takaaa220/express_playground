import { IMessageRepository } from "../../../domains/Message/messageRepository";
import { Message } from "../../../domains/Message/message";

export class MessageRepository implements IMessageRepository {
  constructor(public _messages: Message[] = []) {}

  getAll(channelId: string) {
    return Promise.resolve(this.findByChannelId(channelId));
  }

  get(id: string, channelId: string) {
    const channel = this.findByChannelId(channelId).find((m) => m.id === id);
    return Promise.resolve(channel);
  }

  create(message: Message) {
    return Promise.resolve(message);
  }

  private findByChannelId(channelId: string) {
    return this._messages.filter((m) => m.channelId === channelId);
  }
}
