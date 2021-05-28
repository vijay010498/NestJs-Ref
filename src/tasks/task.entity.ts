import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TasksStatus } from './task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid') //uuid id in postgres database
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TasksStatus;
}
