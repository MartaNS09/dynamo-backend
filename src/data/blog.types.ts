export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  author: {
    name: string;
  };
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  isFeatured: boolean;
  isPinned: boolean;
  seo?: {
    metaTitle: string;
    metaDescription: string;
  };

  // ПРОСТОЙ МАССИВ СТРОК ДЛЯ ГАЛЕРЕИ
  gallery?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  color: string;
  icon?: string;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
  search?: string;
  sort?: "newest" | "popular" | "featured";
}

// Экспорт типа для компонентов
export type BlogPostType = BlogPost;
export type BlogCategoryType = BlogCategory;
