import { TeamName } from "./name";
import { User } from "../User/user";
import { DomainError } from "../helpers/error";
import { Channel } from "../Channel/channel";
import { ChannelStatus } from "../Channel/status";

export class Team {
  private _id: string;
  private _name: TeamName;
  private _ownerId: User["id"];
  private _userIds: User["id"][];
  private _deleted: boolean = false;

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
    return this._name.value;
  }

  updateName(name: string, user: User) {
    if (!user.isOwner) {
      throw new DomainError("チーム名の変更はオーナーのみ行うことができます");
    }

    this._name = new TeamName(name);
  }

  get ownerId() {
    return this._ownerId;
  }

  get userIds() {
    return this._userIds;
  }

  get deleted() {
    return this._deleted;
  }

  belongsTo(user: User) {
    return user.teamId === this.id;
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

  changeOwner(currentOwner: User, newOwner: User) {
    if (currentOwner.teamId !== this.id || newOwner.teamId !== this.id)
      throw new DomainError("オーナーの交代は同一チーム内で行うことができます");

    if (!currentOwner.isOwner || !newOwner.isAdmin || this.ownerId !== currentOwner.id)
      throw new DomainError("権限がおかしいんだよなぁ...");

    this._ownerId = newOwner.id;
  }

  deleteTeam(host: User) {
    if (host.teamId !== this.id) {
      throw new DomainError("別チームの削除はできません");
    }

    if (!host.isOwner) {
      throw new DomainError("チームの削除はオーナーしかできません");
    }

    this._deleted = true;
  }

  createChannel(host: User, id: string, channelName: string, status: ChannelStatus) {
    if (host.isMember) {
      throw new DomainError("メンバー権限のユーザはチャンネルを作成する事ができません");
    }

    return new Channel(id, channelName, host.id, [host.id], this.id, status);
  }

  private isOwner(targetId: User["id"]) {
    return targetId === this.ownerId;
  }

  private isExistedUser(targetId: User["id"]) {
    return this._userIds.includes(targetId);
  }

  updateAttributes(host: User, attributes: { name: string }) {
    if (!this.belongsTo(host)) {
      throw new DomainError("別チームを操作する事はできません");
    }

    if (!host.isOwner) {
      throw new DomainError("チーム情報の更新はオーナーだけができます");
    }

    this._name = new TeamName(attributes.name);
  }
}
