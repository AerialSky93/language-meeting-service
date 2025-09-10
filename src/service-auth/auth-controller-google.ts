import { Controller, Get, Res, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserAccountGetResponse } from '../dto/user-account-dto/user-account-get-response';
import type { AuthGetResponse } from './auth-dto/auth-get-response';
import { UserAccountRepository } from '../repository/user-account-repository';
import { OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  private googleOAuth2Client: OAuth2Client;
  private tokenExpirationMs = 3 * 60 * 60 * 1000;

  constructor(private readonly userAccountRepository: UserAccountRepository) {
    this.googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  async googleAuthCallback(
    @Query('googleTokenId') googleTokenId: string,
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<Response<AuthGetResponse>> {
    try {
      let userAccount: UserAccountGetResponse;

      if (googleTokenId) {
        const decoded = jwt.decode(googleTokenId) as any;
        if (!decoded) {
          return res.status(400).json({ error: 'Invalid token' });
        }

        const ticket = await this.googleOAuth2Client.verifyIdToken({
          idToken: googleTokenId,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const ticketPayload = ticket.getPayload();
        if (!ticketPayload) {
          return res.status(400).json({ error: 'Invalid token payload' });
        }

        userAccount = await this.userAccountRepository.getOrCreateUserAccount(
          decoded.sub,
          decoded.name,
          decoded.email,
        );
      } else if (code) {
        return res
          .status(400)
          .json({ error: 'Authorization code flow not fully implemented' });
      } else {
        return res.status(400).json({ error: 'No token or code provided' });
      }

      const token = jwt.sign(
        { id: userAccount.user_account_id },
        process.env.JWT_SECRET!,
      );

      // Set HttpOnly cookie instead of returning token
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: this.tokenExpirationMs,
      });

      const authResponse: AuthGetResponse = {
        user_account_id: userAccount.user_account_id,
        full_name: userAccount.full_name,
        email: userAccount.email,
      };

      return res.json(authResponse);
    } catch (error) {
      console.error('Auth callback error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  }
}
