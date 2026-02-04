import { AppLogger } from "@platform/logger/logger";
import {
  UserDocument,
  UserModel,
} from "@services/user-manage-service/models/user.modal";

export class UserService {
  private readonly logger = new AppLogger(UserService.name);

  constructor() {}

  async getUsers(): Promise<UserDocument[]> {
    const doc = await UserModel.find();
    return doc || [];
  }
}
