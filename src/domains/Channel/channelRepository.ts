import { Channel } from "./channel";
import { Team } from "../Team/team";

export interface IChannelRepository {
  getAllByTeamId(teamId: Team["id"]): Promise<Channel[]>;
  get(channelId: Channel["id"]): Promise<Channel | undefined>;
  create(channel: Channel): Promise<void>;
}
