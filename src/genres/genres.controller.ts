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
import { log } from 'console';
 
@ApiTags('genres')
@Controller({ path: 'genres', version: '1' })
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post('')
  @UseGuards(JwtAuthenticationGuard )

  @ApiOperation({ summary: 'create genre' })
  @ApiResponse({
    status: 201,
    description: 'Return created genre object',
  })
  @ApiBody({ type: GenreDto })
  async create(@Body() dto: GenreDto) {
    console.log("test");
    
    return this.genresService.create(dto);
  }

  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'return list all genres' })
  @ApiResponse({
    status: 200,
    description: 'Return all genres',
  })
  @ApiQuery({ type: PaginationParams })
  async list(@Query() query: PaginationParams) {
    return this.genresService.findAll(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'delete genre' })
  @ApiResponse({
    status: 200,
    description: 'genre deleted',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the genre',
    type: String,
    example: '12345',
  })
  delete(@Param('id') id: number) {
    return this.genresService.deleteOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    description: 'The ID of the genre',
    type: String,
    example: '12345',
  })
  @ApiOperation({ summary: 'update genre' })
  @ApiResponse({
    status: 201,
    description: 'Return updated genre object',
  })
  @ApiBody({ type: GenreDto })
  update(@Param('id') id: string, @Body() dto: GenreDto) {
    return this.genresService.update(id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    description: 'The ID of the genre',
    type: String,
    example: '12345',
  })
  @ApiOperation({ summary: 'fetch genre' })
  @ApiResponse({
    status: 200,
    description: 'Return genre object',
  })
  find(@Param('id') id: string) {
    return this.genresService.find(id);
  }
}
