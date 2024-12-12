import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import Book from 'src/books/entities/book.entity';

@Entity()
export class Author extends BaseEntity {
  @Column({ type: 'text' })
  @Index()
  public name: string;

  @Column({ type: 'text' })
  public biography: string;

  @Column({ type: 'date' })
  public birthDate: Date;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}

export default Author;
