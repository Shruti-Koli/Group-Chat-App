const express = require('express');
const user_controller = require('../controllers/user');

const router = express.Router();

router.post('/signup',user_controller.signup);
router.post('/login',user_controller.login);

module.exports = router;