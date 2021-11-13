const express = require('express');

const isAuth = require('../middlewares/isAuth');
const messageController = require('../controllers/messages');

const router = express.Router();

router.post('/saveMessage', isAuth, messageController.createMessage);

router.get('/getMessages/:receiver', isAuth, messageController.getMessages);

module.exports = router;