import { ChannelName } from "./name";
import { User } from "../User/user";
import { Team } from "../Team/team";

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
}
