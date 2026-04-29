import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [posts, sections, applications] = await Promise.all([
      this.prisma.blogPost.findMany(),
      this.prisma.sportSection.findMany({
        include: {
          trainers: true,
          abonements: true,
        },
      }),
      this.prisma.application.findMany(),
    ]);

    const byStatus = {
      new: applications.filter((a) => a.status === 'new').length,
      inProgress: applications.filter((a) => a.status === 'in_progress').length,
      contacted: applications.filter((a) => a.status === 'contacted').length,
      completed: applications.filter((a) => a.status === 'completed').length,
      cancelled: applications.filter((a) => a.status === 'cancelled').length,
    };

    const bySource = {
      enrollment_form: applications.filter((a) => a.source === 'enrollment_form')
        .length,
      sport_section_page: applications.filter((a) => a.source === 'sport_section_page')
        .length,
      abonement_page: applications.filter((a) => a.source === 'abonement_page').length,
      other: applications.filter((a) => a.source === 'other').length,
    };

    const totalApplications = applications.length || 1;
    const conversionRate = Number(
      ((byStatus.completed / totalApplications) * 100).toFixed(1),
    );

    const popularPosts = posts
      .slice()
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((p) => ({ id: p.id, title: p.title, views: p.views, slug: p.slug }));

    return {
      visits: {
        totalVisits: 0,
        uniqueVisitors: 0,
        averageTime: 0,
        bounceRate: 0,
        byDevice: { desktop: 0, mobile: 0, tablet: 0 },
        bySource: { direct: 0, search: 0, social: 0, referral: 0 },
      },
      content: {
        totalPosts: posts.length,
        totalSections: sections.length,
        totalTrainers: sections.reduce((sum, s) => sum + s.trainers.length, 0),
        totalAbonements: sections.reduce((sum, s) => sum + s.abonements.length, 0),
        popularPosts,
        popularSections: sections.slice(0, 5).map((s) => ({
          id: s.id,
          name: s.name,
          views: 0,
          slug: s.slug,
        })),
      },
      applications: {
        total: applications.length,
        byStatus,
        conversionRate,
        averageResponseTime: 0,
        bySource,
      },
      monthly: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}
