import { MessageContent } from "./content";

export class Message {
  private _id: string;
  private _content: MessageContent;

  constructor(id: string, content: string) {
    this._id = id;
    this._content = new MessageContent(content);
  }

  get id() {
    return this._id;
  }

  get content() {
    return this._content.value;
  }
}
