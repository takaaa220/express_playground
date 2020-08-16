import { User } from "../../../domains/User/user";
import { ISessionRepository } from "../../../usecases/Session/sessionRepository";
import { IUserRepository } from "../../../domains/User/userRepository";

export class SessionRepository implements ISessionRepository {
  private user: User | undefined;
  constructor(private userRepository: IUserRepository) {}

  async getUser() {
    if (this.user) return this.user;

    const userId = "a79af6ed-b82c-4807-bbea-9725cf20f692";
    this.user = await this.userRepository.get(userId);

    return this.user;
  }

  async isSystemOwner() {
    // @TODO: いい感じにsession情報から取得する
    return Promise.resolve(true);
  }
}
