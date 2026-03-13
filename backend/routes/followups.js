const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/followupController');
const { authenticate } = require('../middleware/auth');

router.post('/',                authenticate, ctrl.addFollowup);
router.get('/mine',             authenticate, ctrl.getMyFollowups);
router.get('/student/:student_id', authenticate, ctrl.getFollowups);

module.exports = router;
