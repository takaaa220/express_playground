import { ChannelName } from "./name";
import { User } from "../User/user";
import { Team } from "../Team/team";
import { DomainError } from "../helpers/error";
import { throws } from "assert";

export class Channel {
  private _name: ChannelName;

  constructor(
    private _id: string,
    name: string,
    private _ownerId: User["id"],
    private _userIds: User["id"][],
    private _teamid: Team["id"],
  ) {
    this._name = new ChannelName(name);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name.value;
  }

  get userIds() {
    return this._userIds;
  }

  get teamId() {
    return this._teamid;
  }

  get ownerId() {
    return this._ownerId;
  }

  invite(host: User, target: User) {
    if (host.isMember) {
      throw new DomainError("メンバー権限のユーザは他のユーザを招待することはできません");
    }

    if (host.isAdmin && !this.userIds.includes(host.id)) {
      throw new DomainError("自分が入っていないチャンネルにユーザを招待することはできません");
    }

    if (this.userIds.includes(target.id)) {
      throw new DomainError("すでにチャンネルに入っています");
    }

    if (this.teamId !== host.teamId) {
      throw new DomainError("別のチームのチャンネルにユーザを招待することはできません");
    }

    if (this.teamId !== target.teamId) {
      throw new DomainError("別のチームのユーザをチャンネルに招待することはできません");
    }

    this._userIds = [...this.userIds, target.id];
  }
}
