import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import { ALL_SECTIONS } from '../src/data/sport-sections';

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = connectionString.replace('file:', '');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Начинаем полный импорт секций...');

  for (const section of ALL_SECTIONS) {
    try {
      console.log(`Обрабатываем: ${section.name}`);
      
      // Сначала удаляем существующие связанные данные
      const existing = await prisma.sportSection.findUnique({
        where: { slug: section.slug },
        include: { abonements: true, trainers: true }
      });

      if (existing) {
        // Удаляем старые абонементы и тренеров
        await prisma.abonement.deleteMany({ where: { sectionId: existing.id } });
        await prisma.trainer.deleteMany({ where: { sectionId: existing.id } });
        
        // Обновляем секцию
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
      } else {
        // Создаем новую секцию
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
      }

      // Получаем ID секции для связей
      const dbSection = await prisma.sportSection.findUnique({
        where: { slug: section.slug }
      });

      if (dbSection) {
        // Добавляем абонементы
        for (const abon of section.abonements || []) {
          await prisma.abonement.create({
            data: {
              name: abon.name,
              description: abon.description,
              price: abon.price,
              currency: abon.currency,
              duration: abon.duration,
              features: abon.features ? JSON.stringify(abon.features) : null,
              isPopular: abon.isPopular || false,
              sectionId: dbSection.id,
            },
          });
        }

        // Добавляем тренеров
        for (const trainer of section.trainers || []) {
          await prisma.trainer.create({
            data: {
              name: trainer.name,
              position: trainer.position,
              photo: trainer.photo || '',
              order: 0,
              sectionId: dbSection.id,
            },
          });
        }
      }

      console.log(`✅ Импортирована секция: ${section.name}`);
    } catch (error) {
      console.error(`❌ Ошибка с секцией ${section.name}:`, error);
    }
  }

  console.log('🎉 Полный импорт завершен!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
