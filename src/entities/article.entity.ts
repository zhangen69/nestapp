import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity()
export class Article {
  @IsOptional({ always: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  description: string;

  @IsOptional({ always: true })
  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}