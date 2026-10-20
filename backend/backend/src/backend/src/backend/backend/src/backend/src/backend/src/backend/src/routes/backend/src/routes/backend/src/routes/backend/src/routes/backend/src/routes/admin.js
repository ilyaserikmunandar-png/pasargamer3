import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware.js';
import { asyncHandler } from '../utils.js';
export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('ADMIN'));
adminRouter.get('/stats', asyncHandler(async (_, res) => {
  res.json({ users: await prisma.user.count(), orders: await prisma.order.count() });
}));
