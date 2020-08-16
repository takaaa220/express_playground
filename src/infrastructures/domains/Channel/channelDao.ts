import { ChannelStatus } from "../../../domains/Channel/status";

export class ChannelDao {
  constructor(
    public id: string,
    public name: string,
    public ownerId: string,
    public teamId: string,
    public userIds: string[],
    public status: ChannelStatus,
  ) {}
}
