const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      emailVerified: true,
      googleId: true,
      githubId: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

async function updateProfile(userId, data) {
  const { firstName, lastName, avatar } = data;
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(avatar !== undefined && { avatar })
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return user;
}

module.exports = {
  getProfile,
  updateProfile
};
