import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Checks if database is online
   * GET /
   * @returns String success message
   */
  @Get()
  index() {
    return 'Being Seen database is online!';
  }

  /**
   * Log in user
   * POST /auth/login
   * @param req Request
   * @returns User object or error
   */
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  /**
   * Gets the access token's user profile
   * GET /profile
   * @param req Request
   * @returns User object or error
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Body() user) {
    return user;
  }

  /**
   * Registers a new user
   * POST /auth/register
   * @param user user object
   * @returns user object or error
   */
  @Post('auth/register')
  async register(@Body() user) {
    return await this.usersService.createUser(user);
  }
}
