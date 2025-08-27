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
import { UserAccountService } from '../service/user-account-service';
import { UserAccountGetRequest } from '../dto/user-account-dto/user-account-get-request';
import { UserAccountCreateRequest } from '../dto/user-account-dto/user-account-create-request';
import { UserAccountUpdateRequest } from '../dto/user-account-dto/user-account-update-request';
import { UserAccountCreateResponse } from '../dto/user-account-dto/user-account-create-response';
import { UserAccountGetResponse } from '../dto/user-account-dto/user-account-get-response';
import { UserAccountUpdateResponse } from '../dto/user-account-dto/user-account-update-response';

@Controller()
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post('user-account')
  async createUserAccount(
    @Body() createUserAccountDto: UserAccountCreateRequest,
  ): Promise<UserAccountCreateResponse> {
    try {
      return await this.userAccountService.createUserAccount(createUserAccountDto);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user-account/:id')
  async getUserAccountById(@Param('id') id: string): Promise<UserAccountGetResponse> {
    try {
      const userId = parseInt(id);
      const request: UserAccountGetRequest = {
        userId: userId,
      };
      const userAccount = await this.userAccountService.getUserAccountById(request);

      if (!userAccount) {
        throw new HttpException('User account not found', HttpStatus.NOT_FOUND);
      }

      return userAccount;
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

  @Put('user-account/:id')
  async updateUserAccount(
    @Param('id') id: string,
    @Body() updateUserAccountDto: UserAccountUpdateRequest,
  ): Promise<UserAccountUpdateResponse> {
    try {
      const userId = parseInt(id);
      return await this.userAccountService.updateUserAccount(userId, updateUserAccountDto);
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
