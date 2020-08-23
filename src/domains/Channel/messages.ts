import { Channel } from "./channel";
import { User } from "../User/user";
import { Message } from "../Message/message";

export class ChannelMessages {
  constructor(private _channel: Channel, private _messages: Message[] = []) {}

  get channel() {
    return this._channel;
  }

  get messages() {
    return this._messages;
  }

  sendMessage(message: Message) {
    this._messages = [...this._messages, message];
  }
}
