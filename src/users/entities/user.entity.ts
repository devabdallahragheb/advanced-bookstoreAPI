import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'text' })
  public firstName: string;
  @Column({ type: 'text' })
  public lastName: string;
  @Column({ type: 'text', unique: true })
  public email: string;
  @Column({ type: 'text', unique: true })
  public phone: string;
  @Column({ type: 'text', nullable: true })
  public address: string;
  @Column({ type: 'bytea' })
  @Exclude()
  public password: Blob;
  @Column({ nullable: true, type: 'text' })
  @Exclude()
  public hashedRefreshToken: string | null;
}

export default User;
