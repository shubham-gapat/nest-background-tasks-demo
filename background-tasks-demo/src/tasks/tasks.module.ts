import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { EmailProcessor } from './processors/email.processor';
import { ImageProcessor } from './processors/image.processor';
import { ReportProcessor } from './processors/report.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    }),
    BullModule.registerQueue({
      name: 'image-processing',
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    }),
    BullModule.registerQueue({
      name: 'report-generation',
      defaultJobOptions: {
        removeOnComplete: 5,
        removeOnFail: 3,
      },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, EmailProcessor, ImageProcessor, ReportProcessor],
  exports: [TasksService],
})
export class TasksModule {}
