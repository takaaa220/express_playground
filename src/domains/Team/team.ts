import { TeamName } from "./name";
import { User } from "../User/user";

export class Team {
  private _id: string;
  private _name: TeamName;
  private _owner: User;

  constructor(id: string, name: string, owner: User) {
    this._id = id;
    this._name = new TeamName(name);
    this._owner = owner;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}
