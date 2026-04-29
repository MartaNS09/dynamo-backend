type DefaultSeoSeed = {
  page: string;
  path: string;
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  isActive?: boolean;
};

export const DEFAULT_SEO_SEED: DefaultSeoSeed[] = [
  { page: 'home', path: '/', title: 'Динамо Витебск | Спортивная школа олимпийского резерва' },
  { page: 'about', path: '/about', title: 'О школе | Динамо Витебск' },
  { page: 'history', path: '/history', title: 'История | Динамо Витебск' },
  { page: 'trainers', path: '/trainers', title: 'Тренерский состав | Динамо Витебск' },
  { page: 'contacts', path: '/contacts', title: 'Контакты | Динамо Витебск' },
  { page: 'sports', path: '/sports', title: 'Спортивные секции | Динамо Витебск' },
  { page: 'sports-single', path: '/sports/[slug]', title: 'Секция | Динамо Витебск' },
  { page: 'departments', path: '/departments', title: 'Отделения | Динамо Витебск' },
  { page: 'departments-single', path: '/departments/[slug]', title: 'Отделение | Динамо Витебск' },
  { page: 'blog', path: '/blog', title: 'Новости и блог | Динамо Витебск' },
  { page: 'blog-single', path: '/blog/[slug]', title: 'Статья блога | Динамо Витебск' },
  { page: 'enrollment', path: '/enrollment', title: 'Запись в секции | Динамо Витебск' },
  { page: 'rental', path: '/rental', title: 'Аренда | Динамо Витебск' },
  { page: 'privacy', path: '/privacy', title: 'Политика конфиденциальности | Динамо Витебск' },
  {
    page: 'login',
    path: '/login',
    title: 'Вход в админку | Динамо Витебск',
    robots: 'noindex, nofollow',
  },
  { page: '404', path: '/404', title: 'Страница не найдена | Динамо Витебск' },
];
