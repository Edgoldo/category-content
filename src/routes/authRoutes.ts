import express, { Router } from 'express';
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router: Router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getUser);
router.put('/update', authenticate, authController.updateUser);

export default router;
