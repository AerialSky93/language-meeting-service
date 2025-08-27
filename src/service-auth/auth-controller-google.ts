import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserAccountGetResponse } from '../dto/user-account-dto/user-account-get-response';

interface RequestWithUser extends Request {
  user: UserAccountGetResponse;
}

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const token = jwt.sign(
      { id: req.user.user_account_id },
      process.env.JWT_SECRET,
    );
    res.json({ user: req.user, token });
  }
}
