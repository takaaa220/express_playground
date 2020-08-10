export const createTeamMapper = ({
  id,
  name,
  ownerId,
}: {
  id: string;
  name: string;
  ownerId: string;
}) => {
  const now = new Date();

  return {
    id,
    name,
    ownerId,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateTeamMapper = ({ name, ownerId }: { name: string; ownerId: string }) => {
  const now = new Date();

  return {
    name,
    ownerId,
    updatedAt: now,
  };
};
