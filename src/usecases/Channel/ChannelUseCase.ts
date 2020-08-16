import { ITeamRepository } from "../../domains/Team/teamRepository";
import { ISessionRepository } from "../Session/sessionRepository";
import { UseCaseError } from "../helpers/error";
import { IChannelRepository } from "../../domains/Channel/channelRepository";
import { createId } from "../../helpers/createId";
import { UniqueChannelNameService } from "../../domains/Channel/uniqueChannelNameService";
import { IUserRepository } from "../../domains/User/userRepository";

export class ChannelUseCase {
  constructor(
    private teamRepository: ITeamRepository,

    private sessionRepository: ISessionRepository,
    private channelRepository: IChannelRepository,
    private userRepository: IUserRepository,
  ) {}

  async getAll(teamId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const team = await this.teamRepository.get(teamId);
    if (!team.belongsTo(currentUser)) {
      throw new UseCaseError("他のチームのチャンネルを見ることはできません");
    }

    return this.channelRepository.getAllByTeamId(team.id);
  }

  async create(teamId: string, channelName: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const team = await this.teamRepository.get(teamId);
    const channel = team.createChannel(currentUser, createId(), channelName);

    const uniqueChannelNameService = new UniqueChannelNameService(this.channelRepository);
    uniqueChannelNameService.call(channel);

    await this.channelRepository.create(channel);
    return channel;
  }

  async inviteUser(channelId: string, userId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const targetUser = await this.userRepository.get(userId);

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.invite(currentUser, targetUser);
    console.log({ channel });
    await this.channelRepository.update(channel);
    return channel;
  }
}
