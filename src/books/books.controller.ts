import { Controller, Get, UseGuards, Body, Query, Delete, Param, Post, Put ,Request} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import PaginationParams from 'src/common/types/pagination-params.type';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateBookDto from './dto/create-book.dto';
import UpdateBookDto from './dto/update-book.dto';

@ApiTags('books')
@Controller({ path: 'books', version: '1' })
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully.' })
  @ApiBody({ type: CreateBookDto })
  async create(@Body() dto: CreateBookDto,@Request() req) {
    return this.booksService.create(dto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'List all books' })
  @ApiQuery({ type: PaginationParams })
  @ApiResponse({ status: 200, description: 'List of books' })
  async list(@Query() query: PaginationParams) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Fetch a book by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the book' })
  @ApiResponse({ status: 200, description: 'Book found' })
  async findByID(@Param('id') id: string) {
    return this.booksService.findByID(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the book' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: 200, description: 'Book updated successfully.' })
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully.' })
  async delete(@Param('id') id: string) {
    return this.booksService.deleteOneById(id);
  }
}
