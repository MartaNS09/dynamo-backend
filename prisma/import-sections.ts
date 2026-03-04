import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import { ALL_SECTIONS } from '../src/data/sport-sections';

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = connectionString.replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Начинаем импорт секций в базу данных...');

  for (const section of ALL_SECTIONS) {
    try {
      // Проверяем, есть ли уже такая секция
      const existing = await prisma.sportSection.findUnique({
        where: { slug: section.slug }
      });

      if (existing) {
        // Обновляем существующую
        await prisma.sportSection.update({
          where: { slug: section.slug },
          data: {
            name: section.name,
            shortDescription: section.shortDescription,
            fullDescription: section.fullDescription,
            ageInfo: section.ageInfo,
            category: section.category,
            coverImage: section.coverImage,
            heroImages: section.heroImages ? JSON.stringify(section.heroImages) : null,
            gallery: section.gallery ? JSON.stringify(section.gallery) : null,
            isActive: section.isActive,
            schedule: section.schedule,
            location: section.location,
          },
        });
        console.log(`✅ Обновлена секция: ${section.name}`);
      } else {
        // Создаем новую
        await prisma.sportSection.create({
          data: {
            slug: section.slug,
            name: section.name,
            shortDescription: section.shortDescription,
            fullDescription: section.fullDescription,
            ageInfo: section.ageInfo,
            category: section.category,
            coverImage: section.coverImage,
            heroImages: section.heroImages ? JSON.stringify(section.heroImages) : null,
            gallery: section.gallery ? JSON.stringify(section.gallery) : null,
            isActive: section.isActive,
            schedule: section.schedule,
            location: section.location,
          },
        });
        console.log(`✅ Создана секция: ${section.name}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка с секцией ${section.name}:`, error);
    }
  }

  console.log('🎉 Импорт завершен!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
