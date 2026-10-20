import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const pwd = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', email: 'admin@pg.com', password: pwd, name: 'Admin', role: 'ADMIN' } });
  console.log('Seed sukses. Login: admin / password123');
}
main().finally(() => prisma.$disconnect());
