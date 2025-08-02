import { Router } from 'express';

const router = Router();

router.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'cab-booking-backend' });
});

export default router;
