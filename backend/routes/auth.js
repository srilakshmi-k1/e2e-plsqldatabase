const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register',        ctrl.adminRegister);
router.post('/login',           ctrl.login);
router.post('/activate',        ctrl.activateCounsellor);
router.post('/counsellors',     authenticate, ctrl.addCounsellor);
router.get('/counsellors',      authenticate, ctrl.getCounsellors);
router.get('/branches',         ctrl.getBranches);

module.exports = router;
