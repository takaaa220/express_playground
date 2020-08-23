import { ISessionRepository } from "../../../usecases/Session/sessionRepository";
import { User } from "../../../domains/User/user";

export class SessionRepository implements ISessionRepository {
  constructor(public _user: User | undefined) {}
  getUser() {
    return Promise.resolve(this._user);
  }

  isSystemOwner() {
    return Promise.resolve(false);
  }
}
