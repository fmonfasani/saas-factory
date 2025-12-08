const userService = require('./user.service');

async function getProfile(req, res, next) {
  try {
    const userId = req.user.userId;
    const user = await userService.getProfile(userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, avatar } = req.body;
    
    const user = await userService.updateProfile(userId, { firstName, lastName, avatar });
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
