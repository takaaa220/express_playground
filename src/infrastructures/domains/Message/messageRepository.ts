import { IMessageRepository } from "../../../domains/Message/messageRepository";
import { Message } from "../../../domains/Message/message";
import { connectDb } from "../../database/mongodb";
import { Db } from "mongodb";
import { createMessageMapper } from "./messageMapper";
import { MessageDao } from "./messageDao";

export type MessageDB = {
  id: string;
  content: string;
  channelId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class MessageRepository implements IMessageRepository {
  getAll(channelId: string) {
    return [];
  }

  async get(id: string, channelId: string) {
    const db = await connectDb();

    const data = await this.connection(db).findOne({ id, channelId });
    if (!data) return undefined;

    return this.daoToMessage(new MessageDao(data));
  }

  async create(message: Message) {
    const db = await connectDb();

    await this.connection(db).insertOne(
      createMessageMapper({
        id: message.id,
        content: message.content,
        channelId: message.channelId,
        userId: message.userId,
      }),
    );
    return message;
  }

  private daoToMessage(dao: MessageDao) {
    return new Message(dao.id, dao.userId, dao.channelId, dao.content);
  }

  private connection(db: Db) {
    return db.collection<MessageDB>("messages");
  }
}
