const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/assignmentController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/',       authenticate, requireAdmin, ctrl.assignStudent);
router.post('/bulk',   authenticate, requireAdmin, ctrl.bulkAssign);
router.get('/mine',    authenticate, ctrl.getMyCounsellees);
router.get('/all',     authenticate, requireAdmin, ctrl.getAllAssignments);

module.exports = router;
