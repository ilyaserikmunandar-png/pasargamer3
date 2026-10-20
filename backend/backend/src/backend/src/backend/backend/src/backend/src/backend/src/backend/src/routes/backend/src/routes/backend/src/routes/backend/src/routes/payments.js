import { Router } from 'express';
import midtransClient from 'midtrans-client';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { asyncHandler } from '../utils.js';
export const paymentRouter = Router();
const snap = new midtransClient.Snap({ isProduction: false, serverKey: config.midtrans.serverKey });
paymentRouter.post('/create/:orderId', asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.orderId }, include: { product: true } });
  const trx = await snap.createTransaction({ transaction_details: { order_id: order.orderNumber, gross_amount: order.price } });
  res.json({ token: trx.token });
}));
export const webhookRouter = Router();
webhookRouter.post('/midtrans', asyncHandler(async (req, res) => {
  const { order_id, transaction_status } = req.body;
  if (transaction_status === 'settlement') {
    const order = await prisma.order.findFirst({ where: { orderNumber: order_id } });
    await prisma.order.update({ where: { id: order.id }, data: { status: 'PAID_ESCROW' } });
  }
  res.json({ ok: true });
}));
