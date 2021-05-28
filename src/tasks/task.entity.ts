import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TasksStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

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

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
