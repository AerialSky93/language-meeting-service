const User = require('../service-auth/user');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        const [user, status] = await User.findOrCreate({
          where: {
            social_user_account_id: profile.id,
            name: profile.displayName,
            registration_type: 'google',
          },
        });
        done(null, user);
      },
    ),
  );
};
