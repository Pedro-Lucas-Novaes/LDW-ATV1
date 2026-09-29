import { Router } from 'express';

import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { projectRoutes } from './projectRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);

export { router as appRoutes };
