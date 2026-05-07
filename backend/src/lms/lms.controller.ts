import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LmsService } from './lms.service';

@Controller('lms')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  // COURSES
  @Get('courses')
  async getCourses() {
    return this.lmsService.getCourses();
  }

  @Post('courses')
  async createCourse(@Body() data: any) {
    return this.lmsService.createCourse(data);
  }

  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: string) {
    return this.lmsService.deleteCourse(id);
  }

  // CHAPTERS
  @Post('courses/:id/chapters')
  async createChapter(@Param('id') courseId: string, @Body() data: { title: string; order: number }) {
    return this.lmsService.createChapter(courseId, data.title, data.order);
  }

  // LESSONS
  @Post('chapters/:id/lessons')
  async createLesson(@Param('id') chapterId: string, @Body() data: any) {
    return this.lmsService.createLesson(chapterId, data);
  }

  // PROMPTS
  @Get('prompts')
  async getPrompts() {
    return this.lmsService.getPrompts();
  }

  @Post('prompts')
  async createPrompt(@Body() data: any) {
    return this.lmsService.createPrompt(data);
  }

  // PROGRESS
  @Post('progress')
  async updateProgress(@Body() data: { userId: string; lessonId: string; isCompleted: boolean }) {
    return this.lmsService.updateProgress(data.userId, data.lessonId, data.isCompleted);
  }

  @Get('progress/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.lmsService.getUserProgress(userId);
  }

  @Get('progress/:userId/course/:courseId')
  async getCourseProgress(@Param('userId') userId: string, @Param('courseId') courseId: string) {
    return this.lmsService.getCourseProgress(userId, courseId);
  }

  // EVENTS
  @Get('events')
  async getEvents() {
    return this.lmsService.getEvents();
  }

  @Post('events')
  async createEvent(@Body() data: any) {
    return this.lmsService.createEvent(data);
  }

  // STATS & ADMIN
  @Get('stats/dashboard')
  async getDashboardStats() {
    return this.lmsService.getDashboardStats();
  }

  @Post('enroll')
  async enrollUser(@Body() data: { userId: string; courseId: string }) {
    return this.lmsService.enrollUser(data.userId, data.courseId);
  }
}
