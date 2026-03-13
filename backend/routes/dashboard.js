const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.get('/admin',      authenticate, ctrl.adminDashboard);
router.get('/counsellor', authenticate, ctrl.counsellorDashboard);

module.exports = router;
