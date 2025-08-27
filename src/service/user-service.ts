import { UserRepository } from '../repository/user-repository';
import type { UserGetRequest } from '../dto/user-dto/user-get-request';
import type { UserGetResponse } from '../dto/user-dto/user-get-response';
import type { UserCreateRequest } from '../dto/user-dto/user-create-request';
import type { UserCreateResponse } from '../dto/user-dto/user-create-response';
import type { UserUpdateRequest } from '../dto/user-dto/user-update-request';
import type { UserUpdateResponse } from '../dto/user-dto/user-update-response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    userData: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    try {
      return await this.userRepository.createUser(userData);
    } catch (error) {
      throw new Error(
        `Failed to create user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  async getUserById(
    request: UserGetRequest,
  ): Promise<UserGetResponse> {
    const user = await this.userRepository.getUserById(request);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(
    userId: number,
    request: UserUpdateRequest,
  ): Promise<UserUpdateResponse> {
    if (
      !request.first_name &&
      !request.last_name &&
      !request.email &&
      !request.time_zone
    ) {
      throw new Error('At least one field must be provided for update');
    }

    const user = await this.userRepository.updateUser(
      userId,
      request,
    );
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getOrCreateUser(
    socialUserId: string,
    name: string,
    registrationType: 'google' | 'facebook' | 'email',
    email?: string
  ): Promise<UserGetResponse> {
    try {
      return await this.userRepository.getOrCreateUser(
        socialUserId,
        name,
        registrationType,
        email
      );
    } catch (error) {
      throw new Error(
        `Failed to get or create user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
