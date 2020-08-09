import { DomainError } from "../helpers/error";

export class TeamName {
  private _value: string;

  constructor(value: string) {
    if (!value) {
      throw new DomainError("TeamName is not empty", "InvalidArgument");
    }

    this._value = value;
  }

  get value() {
    return this._value;
  }
}
