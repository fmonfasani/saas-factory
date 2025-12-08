const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const githubId = profile.id;
        
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { email },
              { githubId }
            ]
          }
        });
        
        if (user) {
          if (!user.githubId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                githubId,
                githubUsername: profile.username,
                githubAvatar: profile.photos[0]?.value,
                emailVerified: true
              }
            });
          }
        } else {
          const names = (profile.displayName || '').split(' ');
          user = await prisma.user.create({
            data: {
              email: email || `${profile.username}@github.placeholder`,
              githubId,
              githubUsername: profile.username,
              githubAvatar: profile.photos[0]?.value,
              firstName: names[0] || profile.username,
              lastName: names.slice(1).join(' ') || '',
              emailVerified: !!email
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
