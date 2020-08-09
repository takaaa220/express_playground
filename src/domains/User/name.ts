import { DomainError } from "../helpers/error";

export class UserName {
  private _value: string;

  constructor(value: string) {
    if (!value) {
      throw new DomainError("ユーザ名は必須です", "InvalidArgument");
    }

    this._value = value;
  }

  get value() {
    return this._value;
  }
}
