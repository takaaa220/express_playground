import { IChannelRepository } from "../../../domains/Channel/channelRepository";
import { Channel } from "../../../domains/Channel/channel";
import { connectDb } from "../../database/mongodb";
import { Db } from "mongodb";
import { ChannelDao } from "./channelDao";
import { createChannelMapper, updateChannelMapper } from "./channelMapper";
import { Team } from "../../../domains/Team/team";
import { InfrastructureError } from "../../helpers/error";
import { ChannelStatus } from "../../../domains/Channel/status";

type ChannelDB = {
  id: string;
  name: string;
  ownerId: string;
  teamId: string;
  userIds: string[];
  createdAt: Date;
  updatedAt: Date;
  status?: ChannelStatus;
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
            channelData.status ?? "public",
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
        channelData.status ?? "public",
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
        status: channel.status,
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
          status: channel.status,
        }),
      },
    );
  }

  async delete(channel: Channel) {
    if (!channel.deleted) {
      throw new InfrastructureError("チャンネルの削除に失敗しました");
    }

    const db = await connectDb();
    await this.connection(db).deleteOne({ id: channel.id });
  }

  private daoToChannel(dao: ChannelDao) {
    return new Channel(dao.id, dao.name, dao.ownerId, dao.userIds, dao.teamId, dao.status);
  }

  private connection(db: Db) {
    return db.collection<ChannelDB>("channels");
  }
}
