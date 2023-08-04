const express = require('express');
const groupController = require('../controllers/group');
const authenticate = require('../middlewares/authentication');

const router = express.Router();

router.post('/group', authenticate.authenticate, groupController.addGroup);
router.get('/group', authenticate.authenticate, groupController.getGroups);
router.get('/get-group-users', authenticate.authenticate, groupController.getGroupUsers)

module.exports = router;