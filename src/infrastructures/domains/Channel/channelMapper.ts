import { ChannelStatus } from "../../../domains/Channel/status";

export const createChannelMapper = ({
  id,
  name,
  ownerId,
  teamId,
  userIds,
  status,
}: {
  id: string;
  name: string;
  ownerId: string;
  teamId: string;
  userIds: string[];
  status: ChannelStatus;
}) => {
  const now = new Date();

  return {
    id,
    name,
    ownerId,
    teamId,
    userIds,
    status,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateChannelMapper = ({
  name,
  ownerId,
  userIds,
  status,
}: {
  name: string;
  ownerId: string;
  userIds: string[];
  status: ChannelStatus;
}) => {
  const now = new Date();

  return {
    name,
    ownerId,
    userIds,
    status,
    updatedAt: now,
  };
};
