import { AppLogger } from "@platform/logger/logger";
import {
  UserDocument,
  UserModel,
} from "@services/user-manage-service/models/user.modal";
import { UserDto } from "../dtos/user.dto";
import { HttpException } from "@platform/exceptions/http-exception";

export class UserService {
  private readonly logger = new AppLogger(UserService.name);

  constructor() {}

  public async getUserById(id: string): Promise<UserDto | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? (doc.toObject() as UserDto) : null;
  }

  public async createUser(userData: UserDto): Promise<UserDto> {
    const existingUser = await UserModel.findOne({
      $or: [
        { email: userData.email },
        { employeeId: userData.employeeId },
      ],  
    }).exec();

    if (existingUser) {
      throw new HttpException(400, "User already exist");
    }

    const newUser = new UserModel(userData);
    const savedUser = await newUser.save();
    return savedUser.toObject() as UserDto;
  }

  public async updateUser(id: string, userData: UserDto): Promise<UserDto> {
    const existingUser = await UserModel.findById(id).exec();
    if (!existingUser) {
      throw new HttpException(404, "User not found");
    }

    Object.assign(existingUser, userData);
    const updatedUser = await existingUser.save();
    return updatedUser.toObject() as UserDto;
  }

  public async findUserByEmailOrEmployeeId(email?: string, employeeId?: string): Promise<UserDto | null> {
    if (!email && !employeeId) {
      throw new HttpException(400, "At least one of email or employeeId must be provided");
    }
    
    const doc = await UserModel.findOne({
      $or: [
        { email },
        { employeeId },
      ],  
    }).exec();
    
    return doc ? (doc.toObject() as UserDto) : null;
  }
}