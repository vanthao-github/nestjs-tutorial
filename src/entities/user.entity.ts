import { BaseEntity } from './base.entity';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bycrypt from 'bcrypt';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Customer = 'customer',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  email!: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  full_name!: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Admin })
  role!: string | null;

  @Column({ type: 'varchar', nullable: true, length: 255, unique: true })
  refresh_token!: string;

  @Column({ type: 'timestamp', nullable: true })
  refresh_token_expires_at!: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bycrypt.hashSync(this.password, 14);
  }
}
