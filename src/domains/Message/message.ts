import { MessageContent } from "./content";

export class Message {
  private _content: MessageContent;

  constructor(
    private _id: string,
    private _userId: string,
    private _channelId: string,
    content: string,
  ) {
    this._content = new MessageContent(content);
  }

  get id() {
    return this._id;
  }

  get content() {
    return this._content.value;
  }

  get userId() {
    return this._userId;
  }

  get channelId() {
    return this._channelId;
  }
}
