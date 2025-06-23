import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('stats')
  async getQueueStats() {
    return this.tasksService.getQueueStats();
  }

  @Get(':queueName/:jobId')
  async getJobDetails(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    return this.tasksService.getJobDetails(queueName, jobId);
  }
}
