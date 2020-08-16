import { UserRole } from "../../../domains/User/role";

export const createUserMapper = ({
  id,
  name,
  role,
  teamId,
}: {
  id: string;
  name: string;
  role: UserRole;
  teamId: string;
}) => {
  const now = new Date();

  return {
    id,
    name,
    role,
    teamId,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateUserMapper = ({ name, role }: { name: string; role: UserRole }) => {
  const now = new Date();

  return {
    name,
    role,
    updatedAt: now,
  };
};
