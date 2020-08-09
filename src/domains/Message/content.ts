import { DomainError } from "../helpers/error";

export class MessageContent {
  private _value: string;

  constructor(content: string) {
    if (!content) {
      throw new DomainError("メッセージは１文字以上含む必要があります", "InvalidArgument");
    }

    this._value = content;
  }

  get value() {
    return this._value;
  }
}
