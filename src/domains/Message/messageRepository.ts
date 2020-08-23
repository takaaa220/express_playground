import { Message } from "./message";

export interface IMessageRepository {
  getAll(channelId: string): Promise<Message>[];
  get(id: string, channelId: string): Promise<Message | undefined>;
  create(message: Message): Promise<Message>;
}
