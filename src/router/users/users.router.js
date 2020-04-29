import { Router } from 'express';
import UserController from './users.controller';

const router = Router();

router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);

export const UsersRouter = router;
