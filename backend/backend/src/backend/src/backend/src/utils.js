import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from './config.js';
import { prisma } from './db.js';

export const hashPassword = p => bcrypt.hash(p, 10);
export const comparePassword = (p, h) => bcrypt.compare(p, h);
export const signToken = user => jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
export function sanitizeUser(u) { if (!u) return null; const { password, ...rest } = u; return rest; }
export function genOrderNumber() { return `PG-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`; }
export const calcFee = price => Math.round(price * config.escrowFeeRate);
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
