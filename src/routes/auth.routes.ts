import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginValidator, registerValidator } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/login', validate(loginValidator), authController.login);
router.post('/register', validate(registerValidator), authController.register);

export default router;