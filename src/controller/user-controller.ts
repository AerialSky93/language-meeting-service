import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../service/user-service';
import { UserGetRequest } from '../dto/user-dto/user-get-request';
import { UserCreateRequest } from '../dto/user-dto/user-create-request';
import { UserUpdateRequest } from '../dto/user-dto/user-update-request';
import { UserCreateResponse } from '../dto/user-dto/user-create-response';
import { UserGetResponse } from '../dto/user-dto/user-get-response';
import { UserUpdateResponse } from '../dto/user-dto/user-update-response';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(
    @Body() createUserDto: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserGetResponse> {
    try {
      const userId = parseInt(id);
      const request: UserGetRequest = {
        userId: userId,
      };
      const user = await this.userService.getUserById(request);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserUpdateRequest,
  ): Promise<UserUpdateResponse> {
    try {
      const userId = parseInt(id);
      return await this.userService.updateUser(userId, updateUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
