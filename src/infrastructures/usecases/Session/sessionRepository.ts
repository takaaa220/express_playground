import { User } from "../../../domains/User/user";
import { ISessionRepository } from "../../../usecases/Session/sessionRepository";

export class SessionRepository implements ISessionRepository {
  private id: User["id"] | undefined;

  async getId() {
    if (this.id) return this.id;

    this.id = await Promise.resolve<string>("b12ace8f-5225-4272-a2df-0843a9edff8b");
    return this.id;
  }
}
