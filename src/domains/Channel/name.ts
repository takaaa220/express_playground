import { DomainError } from "../helpers/error";

export class ChannelName {
  private _value: string;

  constructor(value: string) {
    if (!value) {
      throw new DomainError("ChannelName is not empty", "InvalidArgument");
    }

    this._value = value;
  }

  get value() {
    return this._value;
  }
}
