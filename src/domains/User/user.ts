import { UserRole } from "./role";
import { Team } from "../Team/team";
import { UserName } from "./name";

export class User {
  private _name: UserName;

  constructor(
    private _id: string,
    name: string,
    private _role: UserRole,
    private _teamId: Team["id"] = "",
  ) {
    this._name = new UserName(name);
  }

  get id() {
    return this._id;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name.value;
  }

  get teamId() {
    return this._teamId;
  }

  equals(target: User) {
    return this.id === target.id;
  }
}
