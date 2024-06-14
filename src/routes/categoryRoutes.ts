import express, { Router } from 'express';
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router: Router = express.Router();

router.get('/', authenticate, categoryController.getCategories);
router.get('/summary', categoryController.getCategoriesSummary);
router.get('/:id', authenticate, categoryController.getCategoryById);
router.get('/search', [authenticate, authorize(['admin'])], categoryController.searchCategories);
router.post('/', [authenticate, authorize(['admin']), upload.single('image')], categoryController.createCategory);
router.put('/:id', [authenticate, authorize(['admin'])], categoryController.updateCategory);
router.delete('/:id', [authenticate, authorize(['admin'])], categoryController.deleteCategory);

export default router;
