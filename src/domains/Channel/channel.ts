import { ChannelName } from "./name";
import { User } from "../User/user";
import { Team } from "../Team/team";
import { DomainError } from "../helpers/error";
import { ChannelStatus } from "./status";

export class Channel {
  private _name: ChannelName;
  private _deleted?: boolean;

  constructor(
    private _id: string,
    name: string,
    private _ownerId: User["id"],
    private _userIds: User["id"][],
    private _teamid: Team["id"],
    private _status: ChannelStatus,
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

  get deleted() {
    return this._deleted;
  }

  get status() {
    return this._status;
  }

  get isPrivate() {
    return this._status === "private";
  }

  get isPublic() {
    return this._status === "public";
  }

  join(host: User) {
    if (!host.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのチャンネルに参加することはできません");
    }

    if (this.joined(host)) {
      throw new DomainError("すでにチャンネルに入っています");
    }

    if (!host.isOwner && this.isPrivate) {
      throw new DomainError("プライベートチャンネルに参加する権限がありません");
    }

    this.addUser(host);
  }

  leave(host: User) {
    if (!host.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームチャンネルを操作することはできません");
    }

    if (!this.joined(host)) {
      throw new DomainError("チャンネルに入っていません");
    }

    this._userIds = this._userIds.filter((userId) => userId !== host.id);
  }

  invite(host: User, target: User) {
    if (host.isMember) {
      throw new DomainError("メンバー権限のユーザは他のユーザを招待することはできません");
    }

    if (host.isAdmin && !this.joined(host)) {
      throw new DomainError("自分が入っていないチャンネルにユーザを招待することはできません");
    }

    if (this.joined(target)) {
      throw new DomainError("すでにチャンネルに入っています");
    }

    if (!host.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのチャンネルにユーザを招待することはできません");
    }

    if (!target.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのユーザをチャンネルに招待することはできません");
    }

    this.addUser(target);
  }

  delete(host: User) {
    if (!this.hasAuthority(host)) {
      throw new DomainError("権限がありません");
    }

    if (!host.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのチャンネルを操作する事はできません");
    }

    this._deleted = true;
  }

  removeUser(host: User, target: User) {
    if (!this.hasAuthority(host)) {
      throw new DomainError("他のユーザを削除する権限がありません");
    }

    if (this.joined(target)) {
      throw new DomainError("チャンネルに所属していません");
    }

    if (!host.belongsToTeam(this.teamId) || !target.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのチャンネルの操作をすることはできません");
    }

    this._userIds = this.userIds.filter((userId) => userId !== target.id);
  }

  updateName(host: User, name: string) {
    if (!this.hasAuthority(host)) {
      throw new DomainError("権限がありません");
    }

    if (!host.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのチャンネルを操作する事はできません");
    }

    this._name = new ChannelName(name);
  }

  changeStatus(host: User, isPrivate: boolean) {
    if (!this.hasAuthority(host)) {
      throw new DomainError("権限がありません");
    }

    if (!host.belongsToTeam(this.teamId)) {
      throw new DomainError("別のチームのチャンネルを操作することはできません");
    }

    this._status = isPrivate ? "private" : "public";
  }

  private hasAuthority(host: User) {
    return !(host.isMember || (host.isAdmin && host.id !== this.ownerId));
  }

  private joined(user: User) {
    return this.userIds.includes(user.id);
  }

  private addUser(user: User) {
    this._userIds = [...this._userIds, user.id];
  }
}
