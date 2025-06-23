import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('email')
  async handleEmailJob(job: Job) {
    this.logger.log(`Processing email job ${job.id}`);
    
    const { title, payload } = job.data;
    
    // Simulate email processing
    await job.progress(25);
    await this.delay(1000);
    
    await job.progress(50);
    this.logger.log(`Preparing email: ${title}`);
    await this.delay(1000);
    
    await job.progress(75);
    this.logger.log(`Sending email to: ${payload?.recipient || 'default@example.com'}`);
    await this.delay(1000);
    
    await job.progress(100);
    this.logger.log(`Email job ${job.id} completed successfully`);
    
    return { 
      status: 'sent', 
      recipient: payload?.recipient || 'default@example.com',
      sentAt: new Date() 
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}