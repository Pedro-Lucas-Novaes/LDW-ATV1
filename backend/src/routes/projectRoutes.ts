import { Router } from 'express';

import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', ProjectController.index);
router.get('/:id', ProjectController.show);
router.post('/', ProjectController.create);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.delete);

export { router as projectRoutes };
