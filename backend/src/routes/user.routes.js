const express = require('express');
const router = express.Router();
const userController = require('../users/user.controller');
const { authenticateJWT } = require('../auth/middleware/auth.middleware');

router.get('/profile', authenticateJWT, userController.getProfile);

router.put('/profile', authenticateJWT, userController.updateProfile);

module.exports = router;
