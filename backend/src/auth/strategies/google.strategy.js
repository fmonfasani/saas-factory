const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email },
              { googleId }
            ]
          }
        });
        
        if (user) {
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId,
                googleEmail: email,
                googleAvatar: profile.photos[0]?.value,
                emailVerified: true
              }
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              googleEmail: email,
              googleAvatar: profile.photos[0]?.value,
              firstName: profile.name.givenName || '',
              lastName: profile.name.familyName || '',
              emailVerified: true
            }
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
