import { User } from "../../../domains/User/user";
import { ISessionRepository } from "../../../usecases/Session/sessionRepository";

export class SessionRepository implements ISessionRepository {
  private id: User["id"] | undefined;

  async getId() {
    if (this.id) return this.id;

    this.id = await Promise.resolve<string>("current");
    return this.id;
  }
}
