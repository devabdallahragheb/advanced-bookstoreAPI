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
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import CreateAuthorDto from './dto/create-author.dto';
import UpdateAuthorDto from './dto/update-author.dto';
import PaginationParams from 'src/common/types/pagination-params.type';

@ApiTags('authors')
@Controller({ path: 'authors', version: '1' })
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Return created author object' })
  @ApiBody({ type: CreateAuthorDto })
  async create(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Return a list of all authors' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all authors' })
  @ApiQuery({ type: PaginationParams })
  async list(@Query() query: PaginationParams) {
    return this.authorsService.findAll(query);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Delete an author by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Author deleted' })
  @ApiParam({ name: 'id', description: 'The ID of the author', type: String, example: '12345' })
  async delete(@Param('id') id: string) {
    return this.authorsService.deleteOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update an author by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated author object' })
  @ApiParam({ name: 'id', description: 'The ID of the author', type: String, example: '12345' })
  @ApiBody({ type: UpdateAuthorDto })
  async update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Fetch an author by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return author object' })
  @ApiParam({ name: 'id', description: 'The ID of the author', type: String, example: '12345' })
  async findByID(@Param('id') id: string) {
    return this.authorsService.findByID(id);
  }
}
