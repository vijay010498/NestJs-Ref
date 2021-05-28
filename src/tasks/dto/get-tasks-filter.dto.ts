import { TasksStatus } from '../task-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TasksStatus)
  status?: TasksStatus; //?optional

  @IsOptional()
  @IsString()
  search?: string; //?optional
}
