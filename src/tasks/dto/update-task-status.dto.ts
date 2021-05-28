import { TasksStatus } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TasksStatus)
  status: TasksStatus;
}
