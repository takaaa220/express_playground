export const createChannelMapper = ({
  id,
  name,
  ownerId,
  teamId,
  userIds,
}: {
  id: string;
  name: string;
  ownerId: string;
  teamId: string;
  userIds: string[];
}) => {
  const now = new Date();

  return {
    id,
    name,
    ownerId,
    teamId,
    userIds,
    createdAt: now,
    updatedAt: now,
  };
};
