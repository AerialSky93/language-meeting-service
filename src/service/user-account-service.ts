import { UserAccountRepository } from '../repository/user-account-repository';
import type { UserAccountGetRequest } from '../dto/user-account-dto/user-account-get-request';
import type { UserAccountGetResponse } from '../dto/user-account-dto/user-account-get-response';
import type { UserAccountCreateRequest } from '../dto/user-account-dto/user-account-create-request';
import type { UserAccountCreateResponse } from '../dto/user-account-dto/user-account-create-response';
import type { UserAccountUpdateRequest } from '../dto/user-account-dto/user-account-update-request';
import type { UserAccountUpdateResponse } from '../dto/user-account-dto/user-account-update-response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAccountService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async createUserAccount(
    userAccountData: UserAccountCreateRequest,
  ): Promise<UserAccountCreateResponse> {
    try {
      return await this.userAccountRepository.createUserAccount(
        userAccountData,
      );
    } catch (error) {
      throw new Error(
        `Failed to create user account: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  async getUserAccountById(
    request: UserAccountGetRequest,
  ): Promise<UserAccountGetResponse> {
    const userAccount =
      await this.userAccountRepository.getUserAccountById(request);
    if (!userAccount) {
      throw new Error('User account not found');
    }

    return userAccount;
  }

  async updateUserAccount(
    userId: number,
    request: UserAccountUpdateRequest,
  ): Promise<UserAccountUpdateResponse> {
    if (!request.full_name && !request.email && !request.time_zone) {
      throw new Error('At least one field must be provided for update');
    }

    const userAccount = await this.userAccountRepository.updateUserAccount(
      userId,
      request,
    );
    if (!userAccount) {
      throw new Error('User account not found');
    }

    return userAccount;
  }

  async getOrCreateUserAccount(
    userSourceId: string,
    name: string,
    email?: string,
  ): Promise<UserAccountGetResponse> {
    try {
      return await this.userAccountRepository.getOrCreateUserAccount(
        userSourceId,
        name,
        email,
      );
    } catch (error) {
      throw new Error(
        `Failed to get or create user account: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
