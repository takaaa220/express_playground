import { User } from "../../../domains/User/user";
import { ISessionRepository } from "../../../usecases/Session/sessionRepository";
import { IUserRepository } from "../../../domains/User/userRepository";

export class SessionRepository implements ISessionRepository {
  private user: User | undefined;
  constructor(private userRepository: IUserRepository) {}

  async getUser() {
    if (this.user) return this.user;

    const userId = "2332bcb5-a7b9-49c3-a28a-feea947be624";
    this.user = await this.userRepository.get(userId);

    return this.user;
  }

  async isSystemOwner() {
    // @TODO: いい感じにsession情報から取得する
    return Promise.resolve(true);
  }
}
