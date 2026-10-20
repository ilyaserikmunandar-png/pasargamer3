import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { prisma } from './db.js';
import { sanitizeUser } from './utils.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = sanitizeUser(user);
    next();
  } catch (e) { res.status(401).json({ error: 'Invalid token' }); }
}
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
export function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({ error: err.message });
}
