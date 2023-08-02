const express = require('express');
const chatController = require('../controllers/chat');
const authenticate = require('../middlewares/authentication');

const router = express.Router();

router.post('/message', authenticate.authenticate, chatController.addChat);
router.get('/message', authenticate.authenticate, chatController.getChats);
//previousId
module.exports = router;