import { Channel } from "../../../domains/Channel/channel";
import { User } from "../../../domains/User/user";
import { Team } from "../../../domains/Team/team";
import { MessageUseCase } from "../../../usecases/Message/MessageUseCase";
import { SessionRepository } from "../repositories/sessionRepository";
import { MessageRepository } from "../repositories/messageRepository";
import { ChannelRepository } from "../repositories/channelRepository";
import { Message } from "../../../domains/Message/message";

const TEAM = new Team("team1", "team1", "owner", ["owner", "admin", "member"]);
const OTHER_TEAM = new Team("team2", "team2", "other-owner", ["othwer-owner"]);

const OWNER = new User("owner", "owner1", "Owner", TEAM.id, false);
const ADMIN = new User("admin", "admin1", "Admin", TEAM.id, false);
const MEMBER = new User("member", "member1", "Member", TEAM.id, false);
const DEACTIVATED_USER = new User("member2", "deactivated", "Member", TEAM.id, true);
const OTHER_TEAM_OWNER = new User("other-owner", "owner1", "Owner", OTHER_TEAM.id, false);

const CHANNEL = new Channel("channel-1", "Channel1", OWNER.id, [OWNER.id], TEAM.id, "public");
const ADMIN_CHANNEL = new Channel("channel-2", "Channel1", ADMIN.id, [ADMIN.id], TEAM.id, "public");
const OTHER_TEAM_CHANNEL = new Channel(
  "channel-3",
  "Channel3",
  OTHER_TEAM_OWNER.id,
  [OTHER_TEAM_OWNER.id],
  OTHER_TEAM.id,
  "public",
);

const MESSAGE = new Message("message-1", OWNER.id, CHANNEL.id, "hello world");
const ADMIN_CHANNEL_MESSAGE = new Message("message-2", OWNER.id, ADMIN_CHANNEL.id, "hello world");
const OTHER_TEAM_MESSAGE = new Message(
  "message-3",
  OTHER_TEAM_OWNER.id,
  OTHER_TEAM_CHANNEL.id,
  "hello world",
);

const channelRepository = new ChannelRepository([CHANNEL, ADMIN_CHANNEL, OTHER_TEAM_CHANNEL]);
const messageRepository = new MessageRepository([
  MESSAGE,
  ADMIN_CHANNEL_MESSAGE,
  OTHER_TEAM_MESSAGE,
]);

describe("MessageUseCase", () => {
  describe("getAll()", () => {
    describe("ログインしていない場合", () => {
      it("エラーが起きる", async () => {
        const useCase = new MessageUseCase(
          new SessionRepository(undefined),
          messageRepository,
          channelRepository,
        );

        expect(useCase.getAll(CHANNEL.id)).rejects.toThrow();
      });
    });

    describe("OWNERでログインしている場合", () => {
      const sessionRepository = new SessionRepository(OWNER);

      it("参加しているチャンネルのメッセージが見れる", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        const messages = await useCase.getAll(CHANNEL.id);
        expect(messages).toStrictEqual([MESSAGE]);
      });

      it("参加していないチャンネルのメッセージも見れる", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        const messages = await useCase.getAll(ADMIN_CHANNEL.id);
        expect(messages).toStrictEqual([ADMIN_CHANNEL_MESSAGE]);
      });

      it("別チームのチャンネルのメッセージは見れない", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        expect(useCase.getAll(OTHER_TEAM_CHANNEL.id)).rejects.toThrow();
      });
    });

    describe("ADMINでログインしている場合", () => {
      const sessionRepository = new SessionRepository(ADMIN);

      it("参加しているチャンネルのメッセージが見れる", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        const messages = await useCase.getAll(ADMIN_CHANNEL.id);
        expect(messages).toStrictEqual([ADMIN_CHANNEL_MESSAGE]);
      });

      it("参加していないチャンネルのメッセージも見れる", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        expect(useCase.getAll(CHANNEL.id)).rejects.toThrow();
      });

      it("別チームのチャンネルのメッセージは見れない", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        expect(useCase.getAll(OTHER_TEAM_CHANNEL.id)).rejects.toThrow();
      });
    });
  });

  describe("create()", () => {
    describe("ログインしていない", () => {
      it("送信できない", () => {
        const useCase = new MessageUseCase(
          new SessionRepository(undefined),
          messageRepository,
          channelRepository,
        );

        expect(useCase.create(CHANNEL.id, "new message")).rejects.toThrow();
      });
    });

    describe("無効なユーザでログインしている", () => {
      it("送信できない", () => {
        const useCase = new MessageUseCase(
          new SessionRepository(DEACTIVATED_USER),
          messageRepository,
          channelRepository,
        );

        expect(useCase.create(CHANNEL.id, "new message")).rejects.toThrow();
      });
    });

    describe("有効なユーザでログインしている", () => {
      const sessionRepository = new SessionRepository(OWNER);

      it("送信できる", async () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        const newMessage = await useCase.create(CHANNEL.id, "hello world");
        expect(newMessage.content).toBe("hello world");
      });

      it("空文字のメッセージは送信できない", () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        expect(useCase.create(CHANNEL.id, "")).rejects.toThrow();
      });

      it("所属していないチャンネルには、メッセージを送信できない", () => {
        const useCase = new MessageUseCase(sessionRepository, messageRepository, channelRepository);

        expect(useCase.create(ADMIN_CHANNEL.id, "hello world")).rejects.toThrow();
      });
    });
  });
});
