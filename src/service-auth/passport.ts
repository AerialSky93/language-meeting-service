import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile } from 'passport-google-oauth20';
import { UserAccountRepository } from '../repository/user-account-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassportService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  initialize(passport: PassportStatic) {
    passport.serializeUser((user: any, done: any) => {
      done(null, user);
    });

    passport.deserializeUser((user: any, done: any) => {
      done(null, user);
    });

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_APP_CALLBACK_URL!,
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: any,
        ) => {
          const user = await this.userAccountRepository.getOrCreateUserAccount(
            profile.id,
            profile.displayName,
            'google',
            profile.emails?.[0]?.value,
          );
          done(null, user);
        },
      ),
    );
  }
}

export default PassportService;
