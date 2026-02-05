import { AppLogger } from "@platform/logger/logger";
import {
  UserDocument,
  UserModel,
} from "@services/user-manage-service/models/user.modal";
import { UserDto } from "../dtos/user.dto";

export class UserService {
  private readonly logger = new AppLogger(UserService.name);

  constructor() {}

  public async getUserById(id: string): Promise<UserDto | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? (doc.toObject() as UserDto) : null;
  }

  public async createUser(userData: UserDto): Promise<UserDto> {
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();
    return savedUser.toObject() as UserDto;
  }
}
