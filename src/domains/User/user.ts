import { UserRole } from "./role";

export class User {
  constructor(private _id: string, private _name: string, private _role: UserRole) {}

  get id() {
    return this._id;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }
}
