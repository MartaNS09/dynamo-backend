import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posts = [
  {
    slug: 'chempionat-vitebskoj-oblasti-po-lyzhnym-gonkam-2026',
    title: 'Чемпионат Витебской области по лыжным гонкам',
    excerpt: '21 января 2026 года состоялся чемпионат по лыжным гонкам...',
    content: '...',
    featuredImage: JSON.stringify({ url: '/images/blog/ski-competition-1.jpg', alt: '' }),
    gallery: JSON.stringify(['/images/blog/ski-competition-1.jpg', '/images/blog/ski-competition-2.jpg']),
    category: JSON.stringify({ id: 'competitions', name: 'Соревнования', slug: 'competitions', color: '#00d4aa' }),
    tags: JSON.stringify(['лыжные гонки', 'соревнования']),
    publishedAt: new Date(),
    readTime: 3,
    views: 124,
    isFeatured: true,
    isPinned: true,
    published: true
  },
  {
    slug: 'intervyu-s-egorom-klyushinom',
    title: 'Егор Клюшин: Путь к победам в кикбоксинге',
    excerpt: 'Интервью с воспитанником СДЮШОР Егором Клюшиным...',
    content: '...',
    featuredImage: JSON.stringify({ url: '/images/blog/kikboxing-1.jpg', alt: '' }),
    gallery: JSON.stringify(['/images/blog/kikboxing-1.jpg', '/images/blog/kikboxing-2.jpg']),
    category: JSON.stringify({ id: 'interviews', name: 'Интервью', slug: 'interviews', color: '#ffd700' }),
    tags: JSON.stringify(['кикбоксинг', 'интервью']),
    publishedAt: new Date(),
    readTime: 4,
    views: 98,
    isFeatured: true,
    isPinned: false,
    published: true
  },
  {
    slug: 'znachenie-sporta-v-zhizni-rebenka',
    title: 'Значение спорта в жизни ребенка',
    excerpt: 'Как спортивные занятия влияют на развитие детей...',
    content: '...',
    featuredImage: JSON.stringify({ url: '/images/blog/sport-importance-4.jpg', alt: '' }),
    gallery: JSON.stringify(['/images/blog/sport-importance-1.jpg', '/images/blog/sport-importance-2.jpg']),
    category: JSON.stringify({ id: 'articles', name: 'Статьи', slug: 'articles', color: '#06b6d4' }),
    tags: JSON.stringify(['спорт', 'дети', 'развитие']),
    publishedAt: new Date(),
    readTime: 5,
    views: 76,
    isFeatured: false,
    isPinned: false,
    published: true
  }
]

async function importData() {
  console.log('Начинаю импорт...')
  
  for (const post of posts) {
    await prisma.blogPost.create({ data: post })
    console.log(`✅ Импортирован: ${post.title}`)
  }
  
  console.log('🎉 Готово!')
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
