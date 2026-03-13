const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const ctrl    = require('../controllers/studentController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.csv') || file.mimetype === 'text/csv')
      cb(null, true);
    else
      cb(new Error('Only CSV files are allowed'), false);
  },
});

router.post('/upload',          authenticate, requireAdmin, upload.single('file'), ctrl.uploadCSV);
router.get('/',                 authenticate, ctrl.getStudents);
router.get('/unassigned',       authenticate, requireAdmin, ctrl.getUnassigned);
router.get('/:id',              authenticate, ctrl.getStudent);
router.get('/:id/ai-suggestion',authenticate, ctrl.getAISuggestion);

module.exports = router;
