import { Model, Schema } from 'mongoose';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');
import { User } from './users.schema';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  /**
   * Find user by username
   * @param username Username query
   * @returns User object if found, null otherwise
   */
  async getUserByUsername(username: string) {
    try {
      const user = await this.UserModel.find({ username }).exec();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Find user by user id
   * @param id User id
   * @returns User object if found, null otherwise
   */
  async getUserById(id: Schema.Types.ObjectId) {
    try {
      const user = await this.UserModel.findById({ _id: id }).exec();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Create new user
   * @param createUserDto User object
   * @returns New user object or error if user creation fails
   */
  async createUser(createUserDto: CreateUserDto) {
    const userExists = await this.getUserByUsername(createUserDto.username);
    if (userExists.length === 0) {
      bcrypt.hash(createUserDto.password, 10, async (error, hash) => {
        if (error) {
          throw new InternalServerErrorException(error);
        }

        const userObject = new this.UserModel({
          username: createUserDto.username,
          password: hash,
          permissions: createUserDto.permissions,
        });

        try {
          const newUser = await userObject.save();
          return newUser;
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      });
    } else {
      throw new ConflictException('Username already exists');
    }
  }
}
