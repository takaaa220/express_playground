import { User } from "../../../domains/User/user";
import { IUserRepository } from "../../../domains/User/userRepository";
import { InfrastructureError } from "../../helpers/error";
import { connectDb } from "../../database/mongodb";
import { createUserMapper, updateUserMapper } from "./userMapper";
import { Db } from "mongodb";
import { UserDao } from "./userDao";
import { UserRole } from "../../../domains/User/role";
import { Team } from "../../../domains/Team/team";
import { DomainError } from "../../../domains/helpers/error";

export type UserDB = {
  id: string;
  name: string;
  role: UserRole;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
};

export class UserRepository implements IUserRepository {
  async getAllByTeamId(teamId: Team["id"]) {
    try {
      const db = await connectDb();
      const users = await this.collection(db).find({ teamId }).toArray();

      return users.map((userData) => {
        const dao = new UserDao(
          userData.id,
          userData.name,
          userData.teamId,
          userData.role,
          userData.createdAt,
          userData.updatedAt,
          userData.deleted ?? false,
        );
        return this.daoToUser(dao);
      });
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("エラーが発生しました");
    }
  }

  async get(userId: User["id"]) {
    try {
      const db = await connectDb();
      const user = await this.collection(db).findOne({ id: userId });
      if (!user) {
        throw new InfrastructureError("ユーザが見つかりませんでした");
      }

      const dao = new UserDao(
        user.id,
        user.name,
        user.teamId,
        user.role,
        user.createdAt,
        user.updatedAt,
        user.deleted ?? false,
      );

      return this.daoToUser(dao);
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("エラーが発生しました");
    }
  }

  async create(user: User) {
    try {
      const db = await connectDb();
      const res = await this.collection(db).insertOne(
        createUserMapper({
          id: user.id,
          name: user.name,
          role: user.role,
          teamId: user.teamId,
        }),
      );
      if (!res.result.ok) throw new InfrastructureError("ユーザの作成に失敗しました");

      return user;
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("エラーが発生しました");
    }
  }

  async update(user: User) {
    try {
      const db = await connectDb();
      await this.collection(db).update(
        { id: user.id },
        updateUserMapper({
          name: user.name,
          role: user.role,
        }),
      );

      return user;
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("エラーが発生しました");
    }
  }

  async delete(user: User) {
    if (!user.deleted) {
      throw new DomainError("ユーザの削除に失敗しました");
    }
    const db = await connectDb();

    await this.collection(db).updateOne({ id: user.id }, { deleted: true });
  }

  private collection(db: Db) {
    return db.collection<UserDB>("users");
  }

  private daoToUser(dao: UserDao) {
    return new User(dao.id, dao.name, dao.role, dao.teamId, dao.deleted);
  }
}
