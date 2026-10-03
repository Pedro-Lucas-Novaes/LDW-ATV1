import { Router } from 'express';

import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', authMiddleware, ProjectController.index);
router.get('/:id', authMiddleware, ProjectController.show);
router.post('/', authMiddleware, ProjectController.create);
router.put('/:id', authMiddleware, ProjectController.update);
router.delete('/:id', authMiddleware, ProjectController.delete);

export { router as projectRoutes };
