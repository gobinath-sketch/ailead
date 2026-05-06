import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() body: { email: string; name: string; phone: string }) {
    if (!body.email || !body.name || !body.phone) {
      throw new Error('Email, name, and phone are required');
    }
    return this.authService.sendOtp(body.email, body.name, body.phone);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    if (!body.email || !body.otp) {
      throw new Error('Email and OTP are required');
    }
    return this.authService.verifyOtp(body.email, body.otp);
  }

  @Post('login-otp')
  async loginOtp(@Body() body: { email: string }) {
    if (!body.email) {
      throw new Error('Email is required');
    }
    return this.authService.loginOtp(body.email);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new Error('Email and password are required');
    }
    return this.authService.loginWithPassword(body.email, body.password);
  }

  @Post('update-password')
  async updatePassword(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new Error('Email and password are required');
    }
    return this.authService.updatePassword(body.email, body.password);
  }
}
