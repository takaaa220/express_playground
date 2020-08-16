import { Channel } from "./channel";
import { Team } from "../Team/team";
import { User } from "../User/user";

export interface IChannelRepository {
  getAllByTeamId(teamId: Team["id"]): Promise<Channel[]>;
  getAllByUserId(teamId: Team["id"], userId: User["id"]): Promise<Channel[]>;
  get(channelId: Channel["id"]): Promise<Channel | undefined>;
  create(channel: Channel): Promise<void>;
  update(channel: Channel): Promise<void>;
  updateAll(channels: Channel[]): Promise<void>;
  delete(channel: Channel): Promise<void>;
}
