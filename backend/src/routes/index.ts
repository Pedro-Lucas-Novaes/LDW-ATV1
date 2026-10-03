import { Router } from 'express';

import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { projectRoutes } from './projectRoutes';
import { taskRoutes } from './taskRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export { router as appRoutes };
