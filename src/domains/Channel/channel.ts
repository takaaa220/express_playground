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

  removeUser(host: User, target: User) {
    if (!this.hasAuthority(host)) {
      throw new DomainError("他のユーザを削除する権限がありません");
    }

    if (!this.userIds.includes(target.id)) {
      throw new DomainError("チャンネルに所属していません");
    }

    if (this.teamId !== host.teamId || this.teamId !== target.teamId) {
      throw new DomainError("別のチームのチャンネルの操作をすることはできません");
    }

    this._userIds = this.userIds.filter((userId) => userId !== target.id);
  }

  updateName(host: User, name: string) {
    if (!this.hasAuthority(host)) {
      throw new DomainError("権限がありません");
    }

    if (this.teamId !== host.teamId) {
      throw new DomainError("別のチームのチャンネルを操作する事はできません");
    }

    this._name = new ChannelName(name);
  }

  private hasAuthority(host: User) {
    return !(host.isMember || (host.isAdmin && host.id !== this.ownerId));
  }
}
