import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import ical from 'ical-generator';
import * as nodemailer from 'nodemailer';

@Injectable()
export class LmsService {
  private transporter;

  constructor(private readonly prisma: PrismaService) {
    // Basic transporter for "auto-sync" notifications
    // In production, these would come from env
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER || 'gobinath.m@gktech.ai',
        pass: process.env.MAIL_PASS || 'your_app_password',
      },
    });
  }

  // --- COURSES ---
  async getCourses() {
    return this.prisma.course.findMany({
      include: {
        chapters: {
          include: { lessons: true },
          orderBy: { order: 'asc' },
        },
        enrollments: true,
      },
    });
  }

  async createCourse(data: any) {
    const course = await this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        thumbnail: data.thumbnail,
        isPublished: true,
      },
    });

    // Logic from Frappe LMS: Notify all users about the new course
    const users = await this.prisma.registration.findMany({ where: { role: 'LEARNER' } });
    await this.prisma.notification.createMany({
      data: users.map(user => ({
        userId: user.id,
        title: 'New Course Available!',
        message: `A new course "${course.title}" has been published by ${course.instructor}.`,
      })),
    });

    return course;
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  // --- EVENTS & AUTO-SYNC ---
  async createEvent(data: any) {
    const event = await this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });

    // AUTO-SYNC LOGIC: 
    // 1. Create ICS file
    // 2. Email all learners with the invite
    const learners = await this.prisma.registration.findMany({
      where: { role: 'LEARNER' },
      select: { email: true, fullName: true }
    });

    if (learners.length > 0) {
      const calendar = ical({ name: 'AILeads LMS Events' });
      calendar.createEvent({
        start: new Date(data.startTime),
        end: new Date(data.endTime),
        summary: data.title,
        description: data.description,
        location: data.location || 'Online',
        url: 'https://project.globalknowledgetech.com/dashboard/events'
      });

      const icsContent = calendar.toString();

      // Send to all learners (In a real app, use a background queue)
      for (const learner of learners) {
        try {
          await this.transporter.sendMail({
            from: '"AILeads LMS" <noreply@gktech.ai>',
            to: learner.email,
            subject: `Event Reminder: ${data.title}`,
            text: `Hi ${learner.fullName},\n\nNew event scheduled: ${data.title}\nDescription: ${data.description}\n\nThis has been automatically added to your calendar via the attached invite.`,
            attachments: [
              {
                filename: 'event.ics',
                content: icsContent,
                contentType: 'text/calendar; charset=utf-8; method=REQUEST',
              },
            ],
          });
        } catch (e) {
          console.error(`Failed to send sync email to ${learner.email}:`, e);
        }
      }
    }

    return event;
  }

  async getEvents() {
    return this.prisma.event.findMany({
      orderBy: { startTime: 'asc' },
    });
  }

  // --- STATS (Logic from Learnhouse/Frappe) ---
  async getDashboardStats() {
    const [learnerCount, courseCount, lessonCount, completedLessons] = await Promise.all([
      this.prisma.registration.count({ where: { role: 'LEARNER' } }),
      this.prisma.course.count(),
      this.prisma.lesson.count(),
      this.prisma.progress.count({ where: { isCompleted: true } }),
    ]);

    // Calculate completion rate
    const completionRate = learnerCount > 0 && lessonCount > 0 
      ? Math.round((completedLessons / (learnerCount * lessonCount)) * 100) 
      : 0;

    return {
      totalLearners: learnerCount,
      activeCourses: courseCount,
      avgCompletion: completionRate,
      platformUptime: '99.9%',
      recentActivity: await this.getRecentActivity(),
    };
  }

  private async getRecentActivity() {
    // Get latest completions and enrollments
    const progress = await this.prisma.progress.findMany({
      where: { isCompleted: true },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { user: true, lesson: { include: { chapter: { include: { course: true } } } } }
    });

    return progress.map(p => ({
      type: 'COMPLETION',
      user: p.user.fullName,
      item: p.lesson.title,
      course: p.lesson.chapter.course.title,
      time: p.updatedAt
    }));
  }

  // --- PROGRESS & ENROLLMENT ---
  async enrollUser(userId: string, courseId: string) {
    return this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId }
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { chapter: { courseId } },
      select: { id: true }
    });

    const completed = await this.prisma.progress.findMany({
      where: { userId, isCompleted: true, lesson: { chapter: { courseId } } }
    });

    const total = lessons.length;
    const count = completed.length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    return { total, completed: count, percentage };
  }

  // --- CHAPTERS & LESSONS ---
  async createChapter(courseId: string, title: string, order: number) {
    return this.prisma.chapter.create({
      data: { courseId, title, order },
    });
  }

  async createLesson(chapterId: string, data: any) {
    return this.prisma.lesson.create({
      data: {
        chapterId,
        title: data.title,
        type: data.type,
        content: data.content,
        order: data.order,
        duration: data.duration,
      },
    });
  }

  // --- PROMPTS ---
  async getPrompts() {
    return this.prisma.prompt.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPrompt(data: any) {
    return this.prisma.prompt.create({
      data: {
        title: data.title,
        category: data.category,
        content: data.content,
        description: data.description,
      },
    });
  }

  // --- PROGRESS ---
  async updateProgress(userId: string, lessonId: string, isCompleted: boolean) {
    return this.prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted },
      create: { userId, lessonId, isCompleted },
    });
  }

  async getUserProgress(userId: string) {
    return this.prisma.progress.findMany({
      where: { userId },
      include: { lesson: true }
    });
  }
}
