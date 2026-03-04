import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = connectionString.replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.adminUser.findMany();
  console.log('📋 Пользователи в базе:');
  users.forEach(u => console.log(`   - ${u.email}: ${u.role}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
