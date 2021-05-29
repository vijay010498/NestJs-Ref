import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TasksStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  username: 'vijay',
  id: 'someId',
  password: 'VijayPwd',
  tasks: [],
};

describe('TasksService', () => {
  let taskService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //init a nest js module with taskservice and taskmodule
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    taskService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });
  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });
  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Car',
        description: 'Learn Driving',
        id: 'someId',
        status: TasksStatus.OPEN,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      const mockCreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      tasksRepository.createTask.mockResolvedValue(mockCreateTaskDto);
      const result = await taskService.createTask(mockCreateTaskDto, mockUser);
      expect(result).toEqual(mockCreateTaskDto);
    });
  });
  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      expect(tasksRepository.delete).not.toHaveBeenCalled();
      await taskService.deleteTask('1', mockUser);
      expect(tasksRepository.delete).toHaveBeenCalled();
    });
    it('calls taskRepository.deleteTask() to delete Not found error', () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskService.deleteTask('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  // describe('updateTaskStatus', () => {
  //   it('update task status', async () => {
  //     const save = jest.fn().mockResolvedValue(true);
  //     taskService.getTaskById = jest.fn().mockResolvedValue({
  //       status: TasksStatus.OPEN,
  //       save,
  //     });
  //     expect(taskService.getTaskById).not.toHaveBeenCalled();
  //     expect(save).not.toHaveBeenCalled();
  //     const result = await taskService.updateTaskStatus(
  //       '1',
  //       TasksStatus.DONE,
  //       mockUser,
  //     );
  //     expect(taskService.getTaskById).toHaveBeenCalled();
  //     expect(save).toHaveBeenCalled();
  //     expect(result.status).toEqual(TasksStatus.DONE);
  //   });
  // });
});
