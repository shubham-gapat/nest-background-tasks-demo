import { Controller, Post, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('bulk')
  async createBulkTasks(@Query('count') count: string = '10') {
    const taskCount = parseInt(count, 10) || 10;
    return this.jobsService.createBulkTasks(taskCount);
  }
}
