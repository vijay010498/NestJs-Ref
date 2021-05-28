import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      id,
    });
    if (!found) {
      throw new NotFoundException(`Task with ${id} not Found`);
    }
    return found;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id  ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TasksStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
