import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = connectionString.replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Создаем обычного админа
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@dynamo.by' },
    update: {},
    create: {
      email: 'admin@dynamo.by',
      password: hashedPassword,
      name: 'Администратор',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Создан пользователь:', admin.email, 'роль:', admin.role);

  // Создаем супер-админа
  const superAdmin = await prisma.adminUser.upsert({
    where: { email: 'superadmin@dynamo.by' },
    update: {},
    create: {
      email: 'superadmin@dynamo.by',
      password: hashedPassword,
      name: 'Супер Администратор',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Создан пользователь:', superAdmin.email, 'роль:', superAdmin.role);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
