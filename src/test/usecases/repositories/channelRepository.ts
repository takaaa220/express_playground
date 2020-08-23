import { IChannelRepository } from "../../../domains/Channel/channelRepository";
import { Channel } from "../../../domains/Channel/channel";

export class ChannelRepository implements IChannelRepository {
  constructor(private _channels: Channel[] = []) {}

  getAllByTeamId(teamId: string) {
    return Promise.resolve([]);
  }

  getAllByUserId(userId: string) {
    return Promise.resolve([]);
  }

  get(channelId: string) {
    return Promise.resolve(this.find(channelId));
  }

  create(channel: Channel) {
    return Promise.resolve();
  }

  update(channel: Channel) {
    return Promise.resolve();
  }

  updateAll(channels: Channel[]) {
    return Promise.resolve();
  }

  delete(channel: Channel) {
    return Promise.resolve();
  }

  find(id: string) {
    return this._channels.find((c) => c.id === id);
  }
}
