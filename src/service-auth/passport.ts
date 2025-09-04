import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { Profile } from 'passport-google-oauth20';
import { UserAccountRepository } from '../repository/user-account-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassportService {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  initialize() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_APP_CALLBACK_URL;
    console.log(clientID, clientSecret, callbackURL);
    if (!clientID) {
      throw new Error('Google Client ID environment variable is required');
    }
    if (!clientSecret) {
      throw new Error('Google Client Secret environment variable is required');
    }
    if (!callbackURL) {
      throw new Error(
        'Google App Callback URL environment variable is required',
      );
    }

    passport.serializeUser((user: any, done: any) => {
      done(null, user);
    });

    passport.deserializeUser((user: any, done: any) => {
      done(null, user);
    });

    passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL,
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
