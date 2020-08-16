import { UserRole } from "../../../domains/User/role";

export class UserDao {
  constructor(
    public id: string,
    public name: string,
    public teamId: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date,
    public deleted: boolean,
  ) {}
}
