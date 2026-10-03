import { Router } from 'express';

import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', authMiddleware, TaskController.index);
router.get('/:id', authMiddleware, TaskController.show);
router.post('/', authMiddleware, TaskController.create);
router.put('/:id', authMiddleware, TaskController.update);
router.delete('/:id', authMiddleware, TaskController.delete);

export { router as taskRoutes };
