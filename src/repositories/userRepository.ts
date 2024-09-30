import { User, IUser } from "../models/User";

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async findOneBy(
    label: string,
    value: string | boolean
  ): Promise<IUser | null> {
    return await User.findOne({ [label]: value });
  }
}

export default new UserRepository();
