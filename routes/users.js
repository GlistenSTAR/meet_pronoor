const express = require('express');

const router = express.Router();

const isAuth = require('../middlewares/isAuth');
const usersController = require('../controllers/users');

router.get('/auth', isAuth, usersController.loadUser);

router.post('/signup', usersController.signup);

router.post('/signin', usersController.signin);

router.put('/update/user', isAuth, usersController.updateUserData);

router.put('/changePw', isAuth, usersController.changePassword);

router.get('/searchUsers', isAuth, usersController.searchUsers);

module.exports = router;