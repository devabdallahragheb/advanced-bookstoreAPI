import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import Book from 'src/books/entities/book.entity';

@Entity()
export class Genre extends BaseEntity {
  @Column({ type: 'text' })
  @Index()
  public name: string;

  @OneToMany(() => Book, (book) => book.genre,{ cascade:  ['remove'] })
  books: Book[];
}

export default Genre;
