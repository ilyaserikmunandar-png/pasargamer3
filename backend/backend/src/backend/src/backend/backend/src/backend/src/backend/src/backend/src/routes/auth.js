import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { hashPassword, comparePassword, signToken, sanitizeUser, asyncHandler } from '../utils.js';
export const authRouter = Router();
authRouter.post('/register', asyncHandler(async (req, res) => {
  const data = z.object({ username: z.string(), email: z.string(), password: z.string().min(6), name: z.string(), role: z.enum(['BUYER','SELLER']) }).parse(req.body);
  const user = await prisma.user.create({ data: { ...data, password: await hashPassword(data.password) } });
  res.json({ token: signToken(user), user: sanitizeUser(user) });
}));
authRouter.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await comparePassword(password, user.password))) throw new Error('Login gagal');
  res.json({ token: signToken(user), user: sanitizeUser(user) });
}));
