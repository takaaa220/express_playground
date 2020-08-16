import { IChannelRepository } from "./channelRepository";
import { Channel } from "./channel";
import { DomainError } from "../helpers/error";

export class UniqueChannelNameService {
  constructor(private channelRepository: IChannelRepository) {}

  async call(channel: Channel) {
    const channels = await this.channelRepository.getAllByTeamId(channel.teamId);

    if (channels.some((c) => c.id !== channel.id && c.name === channel.name)) {
      throw new DomainError("チャンネル名は重複できません");
    }
  }
}
