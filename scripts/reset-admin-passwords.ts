/**
 * Одноразовая смена паролей всех AdminUser (bcrypt).
 * Требуется DATABASE_URL (Postgres, как в проде).
 * Запуск: из каталога dynamo-backend: npm run admin:reset-passwords
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

function generatePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const nums = '23456789';
  const sym = '@#$%&*';
  const all = upper + lower + nums + sym;
  let s = '';
  s += upper[randomBytes(2).readUInt16BE(0) % upper.length];
  s += lower[randomBytes(2).readUInt16BE(0) % lower.length];
  s += nums[randomBytes(2).readUInt16BE(0) % nums.length];
  s += sym[randomBytes(2).readUInt16BE(0) % sym.length];
  for (let i = 0; i < 16; i++) {
    s += all[randomBytes(2).readUInt16BE(0) % all.length];
  }
  return s;
}

const DEFAULTS = [
  {
    email: 'superadmin@dynamovitebsk.by',
    name: 'Супер-админ',
    role: 'SUPER_ADMIN' as const,
  },
  {
    email: 'admin@dynamovitebsk.by',
    name: 'Администратор',
    role: 'ADMIN' as const,
  },
  {
    email: 'editor@dynamovitebsk.by',
    name: 'Редактор',
    role: 'EDITOR' as const,
  },
];

function printReport(
  rows: { email: string; role: string; password: string; name: string }[],
) {
  console.log(
    '\n========== СОХРАНИТЕ ДАННЫЕ (пароль показан один раз) ==========\n',
  );
  for (const r of rows) {
    console.log(`Имя:   ${r.name}`);
    console.log(`Роль:  ${r.role}`);
    console.log(`Email: ${r.email}`);
    console.log(`Пароль: ${r.password}`);
    console.log('---');
  }
  console.log('Вход: <ваш_сайт>/login   (например /login на Next.js)\n');
}

async function main() {
  if (!process.env['DATABASE_URL']) {
    console.error('Укажите DATABASE_URL (Postgres), например из .env на сервере.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const existing = await prisma.adminUser.findMany({ orderBy: { email: 'asc' } });

    const out: { email: string; role: string; password: string; name: string }[] =
      [];

    if (existing.length === 0) {
      console.log('Пользователей нет — создаю трёх по умолчанию (SUPER_ADMIN, ADMIN, EDITOR).\n');
      for (const d of DEFAULTS) {
        const plain = generatePassword();
        const hash = await bcrypt.hash(plain, 10);
        await prisma.adminUser.create({
          data: {
            email: d.email,
            name: d.name,
            role: d.role,
            password: hash,
            isActive: true,
          },
        });
        out.push({
          name: d.name,
          email: d.email,
          role: d.role,
          password: plain,
        });
      }
    } else {
      for (const u of existing) {
        const plain = generatePassword();
        const hash = await bcrypt.hash(plain, 10);
        await prisma.adminUser.update({
          where: { id: u.id },
          data: { password: hash },
        });
        out.push({
          name: u.name,
          email: u.email,
          role: u.role,
          password: plain,
        });
      }
    }

    printReport(out);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
