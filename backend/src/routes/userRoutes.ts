import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();


router.post('/', UserController.create);


router.get('/', authMiddleware, UserController.index);
router.get('/:id', authMiddleware, UserController.show);
router.put('/:id', authMiddleware, UserController.update);
router.delete('/:id', authMiddleware, UserController.delete);

export { router as userRoutes };