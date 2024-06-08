const express = require('express');
const contentController = require('../controllers/contentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, contentController.getContent);
router.get('/category/:categoryId', contentController.getContentByCategoryId);
router.get('/:id', authenticate, contentController.getContentById);
router.post('/', [authenticate, authorize(['admin', 'creator'])], contentController.createContent);
router.put('/:id', [authenticate, authorize(['admin', 'creator'])], contentController.updateContent);
router.delete('/:id', [authenticate, authorize(['admin'])], contentController.deleteContent);

module.exports = router;
