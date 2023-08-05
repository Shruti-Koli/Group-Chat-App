const express = require('express');
const groupController = require('../controllers/group');
const authenticate = require('../middlewares/authentication');

const router = express.Router();

router.post('/group', authenticate.authenticate, groupController.addGroup);
router.get('/group', authenticate.authenticate, groupController.getGroups);
router.get('/get-group-users', authenticate.authenticate, groupController.getGroupUsers);
router.post('/add-new-user',authenticate.authenticate, groupController.addNewUser);
router.post('/remove-user',authenticate.authenticate, groupController.removeUser);

router.post('/make-admin',authenticate.authenticate, groupController.addNewAdmin);
router.post('/remove-admin',authenticate.authenticate, groupController.removeAdmin);

module.exports = router;