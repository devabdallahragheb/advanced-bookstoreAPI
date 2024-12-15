import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import Author from 'src/authors/entities/authors.entity';
import Genre from 'src/genres/entities/genres.entity';

@Entity()
export class Book extends BaseEntity {
  @Column({ type: 'text' })
  @Index()
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'date' })
  public publicationDate: Date;

  @ManyToOne(() => Author, (author) => author.books, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: Author;
  
  @ManyToOne(() => Genre, (genre) => genre.books, { eager: true , onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genreId' })
  genre: Genre;
  
}

export default Book;
