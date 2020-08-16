import { Team } from "../../../domains/Team/team";
import { ITeamRepository } from "../../../domains/Team/teamRepository";
import { InfrastructureError } from "../../helpers/error";
import { UserRepository } from "../User/userRepository";
import { connectDb } from "../../database/mongodb";
import { Db } from "mongodb";
import { createTeamMapper, updateTeamMapper } from "./teamMapper";
import { TeamDao } from "./teamDao";

type TeamDB = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class TeamRepository implements ITeamRepository {
  async getAll({ limit = 50 }: { limit?: number }): Promise<Team[]> {
    const db = await connectDb();

    const teamsData = await this.collection(db).find().limit(limit).toArray();

    const userRepository = new UserRepository();
    const teams = teamsData.map(async (team) => {
      const users = await userRepository.getAllByTeamId(team.id);
      const teamUserIds = users.map((u) => u.id);

      const dao = new TeamDao(
        team.id,
        team.name,
        team.ownerId,
        team.createdAt,
        team.updatedAt,
        teamUserIds,
      );

      return this.daoToTeam(dao);
    });

    return Promise.all(teams);
  }

  async get(teamId: Team["id"]) {
    try {
      const db = await connectDb();
      const teamData = await this.collection(db).findOne({ id: teamId });

      if (!teamData) {
        throw new Error("チームが見つかりませんでした");
      }

      const userRepository = new UserRepository();
      const users = await userRepository.getAllByTeamId(teamId);
      const teamUserIds = users.map((u) => u.id);

      const dao = new TeamDao(
        teamData.id,
        teamData.name,
        teamData.ownerId,
        teamData.createdAt,
        teamData.updatedAt,
        teamUserIds,
      );
      return this.daoToTeam(dao);
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("エラーが発生しました");
    }
  }

  async create(team: Team) {
    try {
      const db = await connectDb();
      await this.collection(db).insertOne(
        createTeamMapper({
          id: team.id,
          name: team.name,
          ownerId: team.ownerId,
        }),
      );

      return team;
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("チームの作成にしっぱいしました");
    }
  }

  async update(team: Team) {
    try {
      const db = await connectDb();
      await this.collection(db).update(
        { id: team.id },
        updateTeamMapper({ name: team.name, ownerId: team.ownerId }),
      );

      return team;
    } catch (e) {
      console.error(e);
      throw new InfrastructureError("エラーが発生しました");
    }
  }

  private daoToTeam(dao: TeamDao) {
    return new Team(dao.id, dao.name, dao.ownerId, dao.userIds);
  }

  private collection(db: Db) {
    return db.collection<TeamDB>("teams");
  }
}
