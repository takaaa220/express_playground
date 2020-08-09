import { ChannelName } from "./name";
import { User } from "../User/user";

export class Channel {
  private _name: ChannelName;

  constructor(private _id: string, private _userIds: User["id"][], name: string) {
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
}
