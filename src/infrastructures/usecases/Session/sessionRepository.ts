import { User } from "../../../domains/User/user";
import { ISessionRepository } from "../../../usecases/Session/sessionRepository";

export class SessionRepository implements ISessionRepository {
  private id: User["id"] | undefined;

  async getId() {
    if (this.id) return this.id;

    this.id = await Promise.resolve<string>("017f6e71-0a67-4387-9ca3-468a2f74c3b0");
    return this.id;
  }

  async isSystemOwner() {
    // @TODO: いい感じにsession情報から取得する
    return Promise.resolve(true);
  }
}
