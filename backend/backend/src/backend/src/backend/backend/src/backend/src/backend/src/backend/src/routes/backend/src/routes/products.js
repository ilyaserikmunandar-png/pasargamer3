import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../middleware.js';
import { asyncHandler } from '../utils.js';
export const productRouter = Router();
productRouter.get('/', asyncHandler(async (req, res) => {
  res.json(await prisma.product.findMany({ where: { isActive: true }, include: { game: true } }));
}));
productRouter.post('/', requireAuth, requireRole('SELLER'), asyncHandler(async (req, res) => {
  const data = req.body;
  res.json(await prisma.product.create({ data: { ...data, sellerId: req.user.id, slug: data.title.toLowerCase().replace(/ /g, '-') } }));
}));
