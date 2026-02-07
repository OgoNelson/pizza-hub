import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    try {
      const admin = await this.authService.validateAdmin(
        loginDto.email,
        loginDto.password,
      );

      if (!admin) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        };
      }

      const result = await this.authService.login(admin);

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Login failed',
        error: error.message,
      };
    }
  }

  // @Post('create')
  // async createAdmin(@Body() createAdminDto: any) {
  //   try {
  //     const admin = await this.authService.createAdmin(createAdminDto);

  //     return {
  //       statusCode: HttpStatus.CREATED,
  //       message: 'Admin created successfully',
  //       data: {
  //         id: admin.id,
  //         email: admin.email,
  //         role: admin.role,
  //       },
  //     };
  //   } catch (error) {
  //     return {
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: 'Admin creation failed',
  //       error: error.message,
  //     };
  //   }
  // }
}
