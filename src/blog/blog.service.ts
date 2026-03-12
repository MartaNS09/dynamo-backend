// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateBlogPostDto } from './dto/create-blog.dto';
// import { UpdateBlogPostDto } from './dto/update-blog.dto';

// @Injectable()
// export class BlogService {
//   constructor(private prisma: PrismaService) {}

//   // Подготовка данных для сохранения в БД (JSON поля → строки)
//   private prepareData(dto: CreateBlogPostDto | UpdateBlogPostDto) {
//     const data: any = { ...dto };

//     // Преобразуем JSON поля в строки
//     if (dto.featuredImage) {
//       data.featuredImage = JSON.stringify(dto.featuredImage);
//     }
//     if (dto.gallery) {
//       data.gallery = JSON.stringify(dto.gallery);
//     }
//     if (dto.author) {
//       data.author = JSON.stringify(dto.author);
//     }
//     if (dto.category) {
//       data.category = JSON.stringify(dto.category);
//     }
//     if (dto.tags) {
//       data.tags = JSON.stringify(dto.tags);
//     }
//     if (dto.seo) {
//       data.seo = JSON.stringify(dto.seo);
//     }

//     return data;
//   }

//   // Парсинг данных из БД (строки → JSON)
//   private parseData(post: any) {
//     return {
//       ...post,
//       featuredImage: post.featuredImage ? JSON.parse(post.featuredImage) : null,
//       gallery: post.gallery ? JSON.parse(post.gallery) : [],
//       author: post.author ? JSON.parse(post.author) : null,
//       category: post.category ? JSON.parse(post.category) : null,
//       tags: post.tags ? JSON.parse(post.tags) : [],
//       seo: post.seo ? JSON.parse(post.seo) : null,
//     };
//   }

//   async create(createBlogPostDto: CreateBlogPostDto) {
//     const data = this.prepareData(createBlogPostDto);
//     const post = await this.prisma.blogPost.create({ data });
//     return this.parseData(post);
//   }

//   async findAll() {
//     const posts = await this.prisma.blogPost.findMany({
//       orderBy: { publishedAt: 'desc' },
//     });
//     return posts.map((post) => this.parseData(post));
//   }

//   async findPublished() {
//     const posts = await this.prisma.blogPost.findMany({
//       where: { published: true },
//       orderBy: { publishedAt: 'desc' },
//     });
//     return posts.map((post) => this.parseData(post));
//   }

//   async findOne(id: string) {
//     const post = await this.prisma.blogPost.findUnique({
//       where: { id },
//     });
//     if (!post) {
//       throw new NotFoundException(`Пост с ID ${id} не найден`);
//     }
//     return this.parseData(post);
//   }

//   async findBySlug(slug: string) {
//     const post = await this.prisma.blogPost.findUnique({
//       where: { slug },
//     });
//     if (!post) {
//       throw new NotFoundException(`Пост с slug ${slug} не найден`);
//     }
//     return this.parseData(post);
//   }

//   async update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
//     const data = this.prepareData(updateBlogPostDto);
//     const post = await this.prisma.blogPost.update({
//       where: { id },
//       data,
//     });
//     return this.parseData(post);
//   }

//   async remove(id: string) {
//     return this.prisma.blogPost.delete({
//       where: { id },
//     });
//   }

//   async getCategories() {
//     // Получаем все уникальные категории из постов
//     const posts = await this.prisma.blogPost.findMany({
//       select: { category: true },
//       where: { category: { not: null } },
//     });

//     const categories = posts
//       .map((post) => (post.category ? JSON.parse(post.category) : null))
//       .filter(Boolean);

//     // Убираем дубликаты по id
//     const uniqueCategories = Array.from(
//       new Map(categories.map((cat) => [cat.id, cat])).values(),
//     );

//     return uniqueCategories;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog.dto';
import { UpdateBlogPostDto } from './dto/update-blog.dto';
import { BlogPost } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Подготовка данных для сохранения в БД (JSON поля → строки)
  private prepareData(dto: CreateBlogPostDto | UpdateBlogPostDto): any {
    const data: any = { ...dto };

    if (dto.featuredImage) {
      data.featuredImage = JSON.stringify(dto.featuredImage);
    }
    if (dto.gallery) {
      data.gallery = JSON.stringify(dto.gallery);
    }
    if (dto.author) {
      data.author = JSON.stringify(dto.author);
    }
    if (dto.category) {
      data.category = JSON.stringify(dto.category);
    }
    if (dto.tags) {
      data.tags = JSON.stringify(dto.tags);
    }
    if (dto.seo) {
      data.seo = JSON.stringify(dto.seo);
    }

    return data;
  }

  // Парсинг данных из БД (строки → JSON)
  private parseData(post: BlogPost) {
    return {
      ...post,
      featuredImage: post.featuredImage
        ? JSON.parse(post.featuredImage as string)
        : null,
      gallery: post.gallery ? JSON.parse(post.gallery as string) : [],
      author: post.author ? JSON.parse(post.author as string) : null,
      category: post.category ? JSON.parse(post.category as string) : null,
      tags: post.tags ? JSON.parse(post.tags as string) : [],
      seo: post.seo ? JSON.parse(post.seo as string) : null,
    };
  }

  async create(createBlogPostDto: CreateBlogPostDto) {
    const data = this.prepareData(createBlogPostDto);
    const post = await this.prisma.blogPost.create({ data });
    return this.parseData(post);
  }

  async findAll() {
    const posts = await this.prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return posts.map((post) => this.parseData(post));
  }

  async findPublished() {
    const posts = await this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    return posts.map((post) => this.parseData(post));
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Пост с ID ${id} не найден`);
    }
    return this.parseData(post);
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      throw new NotFoundException(`Пост с slug ${slug} не найден`);
    }
    return this.parseData(post);
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    const data = this.prepareData(updateBlogPostDto);
    const post = await this.prisma.blogPost.update({
      where: { id },
      data,
    });
    return this.parseData(post);
  }

  async remove(id: string) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async getCategories() {
    const posts = await this.prisma.blogPost.findMany({
      select: { category: true },
      where: { category: { not: null } },
    });

    const categories = posts
      .map((post) =>
        post.category ? JSON.parse(post.category as string) : null,
      )
      .filter(Boolean);

    const uniqueCategories = Array.from(
      new Map(categories.map((cat: any) => [cat.id, cat])).values(),
    );

    return uniqueCategories;
  }
}
