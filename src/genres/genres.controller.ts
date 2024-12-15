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
import { GenresService } from './genres.service';
import GenreDto from './dto/genre.dto';

@ApiTags('genres')
@Controller({ path: 'genres', version: '1' })
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({
    status: 201,
    description: 'Genre successfully created',
  })
  @ApiBody({ type: GenreDto })
  async create(@Body() dto: GenreDto) {
    return this.genresService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get list of all genres' })
  @ApiResponse({
    status: 200,
    description: 'Genres retrieved successfully',
  })
  @ApiQuery({ type: PaginationParams })
  async list(@Query() query: PaginationParams) {
    return this.genresService.findAll(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Delete genre by ID' })
  @ApiResponse({
    status: 200,
    description: 'Genre successfully deleted',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the genre to delete',
    type: String,
    example: '12345',
  })
  async delete(@Param('id') id: string) {
    return this.genresService.deleteOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update genre by ID' })
  @ApiResponse({
    status: 200,
    description: 'Genre successfully updated',
  })
  @ApiBody({ type: GenreDto })
  @ApiParam({
    name: 'id',
    description: 'The ID of the genre to update',
    type: String,
    example: '12345',
  })
  async update(@Param('id') id: string, @Body() dto: GenreDto) {
    return this.genresService.update(id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Get genre by ID' })
  @ApiResponse({
    status: 200,
    description: 'Genre retrieved successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the genre to retrieve',
    type: String,
    example: '12345',
  })
  async findByID(@Param('id') id: string) {
    return this.genresService.findByID(id);
  }
}
