import {
  Controller,
  Get,
  UseGuards,
  Body,
  Query,
  Delete,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import PaginationParams from 'src/common/types/pagination-params.type';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import CreateAuthorDto from './dto/create-author.dto';
import UpdateAuthorDto from './dto/update-author.dto';

@ApiTags('authors')
@Controller({ path: 'authors', version: '1' })
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post('')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'create author' })
  @ApiResponse({
    status: 201,
    description: 'Return created author object',
  })
  @ApiBody({ type: CreateAuthorDto })
  async create(@Body() dto: CreateAuthorDto) {
    console.log('Raw DTO:', dto); // Log the DTO
    console.log('birthDate Type:', typeof dto.birthDate);
    return this.authorsService.create(dto);
  }

  @Get('')
  @UseGuards(JwtAuthenticationGuard,)
  @ApiOperation({ summary: 'return list all authors' })
  @ApiResponse({
    status: 200,
    description: 'Return all authors',
  })
  @ApiQuery({ type: PaginationParams })
  async list(@Query() query: PaginationParams) {
    return this.authorsService.findAll(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'delete author' })
  @ApiResponse({
    status: 200,
    description: 'author deleted',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the author',
    type: String,
    example: '12345',
  })
  delete(@Param('id') id: number) {
    return this.authorsService.deleteOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    description: 'The ID of the author',
    type: String,
    example: '12345',
  })
  @ApiOperation({ summary: 'update author' })
  @ApiResponse({
    status: 201,
    description: 'Return updated author object',
  })
  @ApiBody({ type: UpdateAuthorDto })
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    description: 'The ID of the author',
    type: String,
    example: '12345',
  })
  @ApiOperation({ summary: 'fetch author' })
  @ApiResponse({
    status: 200,
    description: 'Return author object',
  })
  find(@Param('id') id: string) {
    return this.authorsService.find(id);
  }
}
