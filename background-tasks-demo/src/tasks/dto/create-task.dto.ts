import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export enum TaskType {
  EMAIL = 'email',
  IMAGE_PROCESSING = 'image_processing',
  REPORT_GENERATION = 'report_generation',
}

export class CreateTaskDto {
  @IsEnum(TaskType)
  type: TaskType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  payload?: any;

  @IsOptional()
  priority?: number;

  @IsOptional()
  delay?: number;
}
