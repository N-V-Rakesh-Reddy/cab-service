import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { testRoutes } from './testRoutes';
import { userRoutes } from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/test', testRoutes);
router.use('/user', userRoutes);
router.get('/health', (_, res) => res.json({ status: 'ok' }));

export default router;
