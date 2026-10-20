import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware.js';
import { asyncHandler, genOrderNumber, calcFee } from '../utils.js';
export const orderRouter = Router();
orderRouter.post('/', requireAuth, asyncHandler(async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: req.body.productId } });
  const order = await prisma.order.create({ data: { orderNumber: genOrderNumber(), productId: p.id, buyerId: req.user.id, sellerId: p.sellerId, price: p.price, fee: calcFee(p.price) } });
  res.json(order);
}));
orderRouter.post('/:id/confirm', requireAuth, asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: 'RELEASED' } }),
    prisma.user.update({ where: { id: order.sellerId }, data: { balance: { increment: order.price - order.fee } } })
  ]);
  res.json({ ok: true });
}));
