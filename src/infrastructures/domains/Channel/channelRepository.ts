import { IChannelRepository } from "../../../domains/Channel/channelRepository";
import { Channel } from "../../../domains/Channel/channel";
import { connectDb } from "../../database/mongodb";
import { Db } from "mongodb";
import { ChannelDao } from "./channelDao";
import { createChannelMapper, updateChannelMapper } from "./channelMapper";
import { Team } from "../../../domains/Team/team";

type ChannelDB = {
  id: string;
  name: string;
  ownerId: string;
  teamId: string;
  userIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export class ChannelRepository implements IChannelRepository {
  async getAllByTeamId(teamId: Team["id"]) {
    const db = await connectDb();
    const channelsData = await this.connection(db).find({ teamId }).toArray();

    return channelsData.map((channelData) =>
      this.daoToChannel(
        this.daoToChannel(
          new ChannelDao(
            channelData.id,
            channelData.name,
            channelData.ownerId,
            channelData.teamId,
            channelData.userIds,
          ),
        ),
      ),
    );
  }

  async get(channelId: Channel["id"]) {
    const db = await connectDb();
    const channelData = await this.connection(db).findOne({ id: channelId });
    if (!channelData) return undefined;

    return this.daoToChannel(
      new ChannelDao(
        channelData.id,
        channelData.name,
        channelData.ownerId,
        channelData.teamId,
        channelData.userIds,
      ),
    );
  }

  async create(channel: Channel) {
    const db = await connectDb();

    await this.connection(db).insertOne(
      createChannelMapper({
        id: channel.id,
        name: channel.name,
        ownerId: channel.ownerId,
        teamId: channel.teamId,
        userIds: channel.userIds,
      }),
    );
  }

  async update(channel: Channel) {
    const db = await connectDb();

    await this.connection(db).updateOne(
      { id: channel.id },
      {
        $set: updateChannelMapper({
          name: channel.name,
          userIds: channel.userIds,
          ownerId: channel.ownerId,
        }),
      },
    );
  }

  private daoToChannel(dao: ChannelDao) {
    return new Channel(dao.id, dao.name, dao.ownerId, dao.userIds, dao.teamId);
  }

  private connection(db: Db) {
    return db.collection<ChannelDB>("channels");
  }
}
