import { TeamName } from "./name";
import { User } from "../User/user";
import { DomainError } from "../helpers/error";

export class Team {
  private _id: string;
  private _name: TeamName;
  private _ownerId: User["id"];
  private _userIds: User["id"][];

  constructor(id: string, name: string, ownerId: User["id"], userIds: User["id"][] = []) {
    this._id = id;
    this._name = new TeamName(name);
    this._ownerId = ownerId;
    this._userIds = userIds;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get ownerId() {
    return this._ownerId;
  }

  get userIds() {
    return this._userIds;
  }

  invite(host: User, target: User) {
    if (!this.isOwner(host.id)) {
      throw new DomainError("チームへの招待はOwnerのみできます", "InvalidArgument");
    }

    if (this.isExistedUser(target.id)) {
      throw new DomainError("すでに招待されています", "InvalidArgument");
    }

    this._userIds = [...this.userIds, target.id];
  }

  private isOwner(targetId: User["id"]) {
    return targetId === this.ownerId;
  }

  private isExistedUser(targetId: User["id"]) {
    return this._userIds.includes(targetId);
  }
}
