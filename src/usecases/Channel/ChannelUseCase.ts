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

  async create(
    teamId: string,
    { channelName, isPrivate }: { channelName: string; isPrivate: boolean },
  ) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const team = await this.teamRepository.get(teamId);
    const channel = team.createChannel(
      currentUser,
      createId(),
      channelName,
      isPrivate ? "private" : "public",
    );

    const uniqueChannelNameService = new UniqueChannelNameService(this.channelRepository);
    await uniqueChannelNameService.call(channel);

    await this.channelRepository.create(channel);
    return channel;
  }

  async delete(channelId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.delete(currentUser);
    return this.channelRepository.delete(channel);
  }

  async update(channelId: string, name: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.updateName(currentUser, name);

    const uniqueChannelNameService = new UniqueChannelNameService(this.channelRepository);
    await uniqueChannelNameService.call(channel);

    await this.channelRepository.update(channel);
    return channel;
  }

  async changeStatus(channelId: string, isPrivate: boolean) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.changeStatus(currentUser, isPrivate);

    await this.channelRepository.update(channel);
    return channel;
  }

  async join(channelId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.join(currentUser);
    await this.channelRepository.update(channel);
    return channel;
  }

  async leave(channelId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.leave(currentUser);
    await this.channelRepository.update(channel);
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
    await this.channelRepository.update(channel);
    return channel;
  }

  async removeUser(channelId: string, userId: string) {
    const currentUser = await this.sessionRepository.getUser();
    if (!currentUser) throw new UseCaseError("ログインしてください");

    const targetUser = await this.userRepository.get(userId);

    const channel = await this.channelRepository.get(channelId);
    if (!channel) {
      throw new UseCaseError("チャンネルが見つかりませんでした");
    }

    channel.removeUser(currentUser, targetUser);
    await this.channelRepository.update(channel);
    return channel;
  }
}
