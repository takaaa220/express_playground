import { MessageDB } from "./messageRepository";

export const createMessageMapper = ({
  id,
  content,
  channelId,
  userId,
}: Pick<MessageDB, "id" | "content" | "channelId" | "userId">): MessageDB => {
  const now = new Date();

  return {
    id,
    content,
    channelId,
    userId,
    createdAt: now,
    updatedAt: now,
  };
};
