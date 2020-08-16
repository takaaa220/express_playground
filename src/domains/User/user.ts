import { UserRole } from "./role";
import { Team } from "../Team/team";
import { UserName } from "./name";
import { DomainError } from "../helpers/error";
import { Channel } from "../Channel/channel";

export class User {
  private _name: UserName;

  constructor(
    private _id: string,
    name: string,
    private _role: UserRole,
    private _teamId: Team["id"] = "",
    private _deleted: boolean,
  ) {
    this._name = new UserName(name);
  }

  get id() {
    return this._id;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name.value;
  }

  get teamId() {
    return this._teamId;
  }

  get isOwner() {
    return this.role === "Owner";
  }

  get hasAdminRole() {
    return this.role !== "Member";
  }

  get isAdmin() {
    return this.role === "Admin";
  }

  get isMember() {
    return this.role === "Member";
  }

  get deleted() {
    return this._deleted;
  }

  equals(target: User) {
    return this.id === target.id;
  }

  downgradeToAdmin(team: Team) {
    if (!this.isOwner) throw new DomainError("オーナー権限を持っていません");

    if (this.teamId !== team.id)
      throw new DomainError("別のチームのオーナーになることはできません");

    this._role = "Admin";
  }

  upgradeToOwner(team: Team) {
    if (!this.isAdmin) throw new DomainError("オーナーは管理者から選ぶ必要があります");

    if (this.teamId !== team.id)
      throw new DomainError("別のチームのオーナーになることはできません");

    this._role = "Owner";
  }

  belongsToTeam(teamId: string) {
    return teamId === this.teamId;
  }

  delete() {
    this._deleted = true;
  }
}
