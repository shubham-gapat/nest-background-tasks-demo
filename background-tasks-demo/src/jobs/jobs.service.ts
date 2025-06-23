import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';
import { TaskType } from '../tasks/dto/create-task.dto';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly tasksService: TasksService) {}

  // Scheduled job that runs every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleScheduledReports() {
    this.logger.log('Running scheduled report generation...');
    
    await this.tasksService.createTask({
      type: TaskType.REPORT_GENERATION,
      title: 'Scheduled System Health Report',
      description: 'Automated system health report generation',
      payload: {
        type: 'system_health',
        automated: true,
      },
    });
  }

  // Scheduled job that runs every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyTasks() {
    this.logger.log('Running hourly maintenance tasks...');
    
    // Example: Clean up old processed images
    await this.tasksService.createTask({
      type: TaskType.IMAGE_PROCESSING,
      title: 'Cleanup Old Images',
      description: 'Remove processed images older than 30 days',
      payload: {
        action: 'cleanup',
        olderThan: '30d',
      },
    });
  }

  async createBulkTasks(count: number = 10) {
    const tasks: any[] = [];
    const taskTypes = [TaskType.EMAIL, TaskType.IMAGE_PROCESSING, TaskType.REPORT_GENERATION];
    
    for (let i = 0; i < count; i++) {
      const randomType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const task = await this.tasksService.createTask({
        type: randomType,
        title: `Bulk Task ${i + 1}`,
        description: `Demo bulk task of type ${randomType}`,
        payload: {
          bulkIndex: i + 1,
          timestamp: new Date(),
        },
        priority: Math.floor(Math.random() * 10),
        delay: Math.floor(Math.random() * 5000), // Random delay up to 5 seconds
      });
      tasks.push(task);
    }
    
    this.logger.log(`Created ${count} bulk tasks`);
    return tasks;
  }
}
