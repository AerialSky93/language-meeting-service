import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserAccountGetResponse } from '../dto/user-account-dto/user-account-get-response';
import { UserAccountRepository } from '../repository/user-account-repository';

interface RequestWithUser extends Request {
  user: UserAccountGetResponse;
  token: string;
}

@Controller('auth')
export class AuthController {
  // Direct repository access is appropriate here since both AuthController and PassportService
  // legitimately need the same user account operations. This avoids unnecessary abstraction
  // layers while maintaining clear separation of concerns.
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  async googleAuthCallback(
    @Query('tokenId') tokenId: string,
    @Query('code') code: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      let user: UserAccountGetResponse;

      if (tokenId) {
        console.log('Handling ID token flow');
        const decoded = jwt.decode(tokenId) as any;

        if (!decoded) {
          return res.status(400).json({ error: 'Invalid token' });
        }

        console.log('socialUserId', decoded.sub);
        console.log('name', decoded.name);
        console.log('email', decoded.email);

        // Direct repository call for ID token flow - same pattern as passport strategy
        user = await this.userAccountRepository.getOrCreateUserAccount(
          decoded.sub,
          decoded.name,
          decoded.email,
        );
      } else if (code) {
        console.log('Handling authorization code flow');
        return res
          .status(400)
          .json({ error: 'Authorization code flow not fully implemented' });
      } else {
        return res.status(400).json({ error: 'No token or code provided' });
      }

      const token = jwt.sign(
        { id: user.user_account_id },
        process.env.JWT_SECRET!,
      );

      res.json({ user, token });
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
}
