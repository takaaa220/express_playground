import { MessageDB } from "./messageRepository";

export class MessageDao {
  public id: string;
  public content: string;
  public channelId: string;
  public userId: string;

  constructor(data: MessageDB) {
    this.id = data.id;
    this.content = data.content;
    this.channelId = data.channelId;
    this.userId = data.userId;
  }
}
