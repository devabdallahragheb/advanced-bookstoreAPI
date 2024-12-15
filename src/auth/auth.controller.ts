import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LogInDto } from './dto/logIn.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '../common/guards/local-authentication.guard';
import { RequestWithUser } from '../common/types/request-with-user.type';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'user register' })
  @ApiResponse({
    status: 201,
    description: 'Return user object with the access tokens',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registrationData: RegisterDto) {
    console.log(registrationData);
    
    const user = await this.authService.register(registrationData);

    const accessToken = this.authService.getJwtAccessToken(user);
    const refreshToken = this.authService.getJwtRefreshToken(user);

    await this.usersService.setActiveRefreshToken(user.id, refreshToken);

    return { user, tokens: { refresh: refreshToken, access: accessToken } };
  }

  @HttpCode(201)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  @ApiOperation({ summary: 'user login' })
  @ApiResponse({
    status: 201,
    description: 'Return user object with the access tokens',
  })
  @ApiBody({ type: LogInDto })
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;

    const accessToken = this.authService.getJwtAccessToken(user);
    const refreshToken = this.authService.getJwtRefreshToken(user);

    await this.usersService.setActiveRefreshToken(user.id, refreshToken);

    return { user, tokens: { refresh: refreshToken, access: accessToken } };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'user logout' })
  @ApiResponse({
    status: 200,
    description: 'user logged out',
  })
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
  }

  @Get('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'refresh user token' })
  @ApiResponse({
    status: 200,
    description: 'returns new access token',
  })
  refresh(@Req() request: RequestWithUser) {
    const accessToken = this.authService.getJwtAccessToken(request.user);
    return { accessToken };
  }
}
