import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
  Body,
  Query,
  Delete,
  Param,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import { RequestWithUser } from '../common/types/request-with-user.type';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import RoleType from 'src/common/constants/role-type.constant';
import PaginationParams from 'src/common/types/pagination-params.type';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'fetch all users' })
  @ApiResponse({
    status: 201,
    description: 'Return list of users',
  })
  @ApiQuery({ type: PaginationParams })
  getAll(@Query() query: PaginationParams) {
    return this.usersService.findAll(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'delete user' })
  @ApiResponse({
    status: 200,
    description: 'book user',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the user',
    type: String,
    example: '12345',
  })
  delete(@Param('id') id: number) {
    return this.usersService.deleteOneById(id);
  }

  @Get('profile')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'fetch user profile' })
  @ApiResponse({
    status: 200,
    description: 'return user object',
  })
  findOne(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'update user' })
  @ApiResponse({
    status: 200,
    description: 'return updated user',
  })
  updateOne(
    @Req() request: RequestWithUser,
    @Body() updatedUserData: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(request.user.id, updatedUserData);
  }
}
