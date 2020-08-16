export const createTeamMapper = ({
  id,
  name,
  ownerId,
  userIds,
}: {
  id: string;
  name: string;
  ownerId: string;
  userIds: string[];
}) => {
  const now = new Date();

  return {
    id,
    name,
    ownerId,
    userIds,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTeamMapper = ({
  name,
  ownerId,
  userIds,
}: {
  name: string;
  ownerId: string;
  userIds: string[];
}) => {
  const now = new Date();

  return {
    name,
    ownerId,
    updatedAt: now,
    userIds,
  };
};
