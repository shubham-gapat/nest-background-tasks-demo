import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTaskDto, TaskType } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('image-processing') private imageQueue: Queue,
    @InjectQueue('report-generation') private reportQueue: Queue,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { type, title, description, payload, priority = 0, delay = 0 } = createTaskDto;
    
    let queue: Queue;
    let jobData = {
      title,
      description,
      payload,
      createdAt: new Date(),
    };

    switch (type) {
      case TaskType.EMAIL:
        queue = this.emailQueue;
        break;
      case TaskType.IMAGE_PROCESSING:
        queue = this.imageQueue;
        break;
      case TaskType.REPORT_GENERATION:
        queue = this.reportQueue;
        break;
      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    const job = await queue.add(type, jobData, {
      priority,
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    this.logger.log(`Created ${type} task with ID: ${job.id}`);
    
    return {
      id: job.id,
      type,
      title,
      status: 'queued',
      createdAt: new Date(),
    };
  }

  async getQueueStats() {
    const emailStats = await this.getQueueStatus(this.emailQueue, 'email');
    const imageStats = await this.getQueueStatus(this.imageQueue, 'image-processing');
    const reportStats = await this.getQueueStatus(this.reportQueue, 'report-generation');

    return {
      email: emailStats,
      imageProcessing: imageStats,
      reportGeneration: reportStats,
    };
  }

  private async getQueueStatus(queue: Queue, name: string) {
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    return {
      name,
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length,
    };
  }

  async getJobDetails(queueName: string, jobId: string) {
    let queue: Queue;
    
    switch (queueName) {
      case 'email':
        queue = this.emailQueue;
        break;
      case 'image-processing':
        queue = this.imageQueue;
        break;
      case 'report-generation':
        queue = this.reportQueue;
        break;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }

    const job = await queue.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found in ${queueName} queue`);
    }

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress(),
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      opts: job.opts,
    };
  }
}