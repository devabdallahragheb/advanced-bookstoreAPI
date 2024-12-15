import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Processor('notifications')
@Injectable()
export class NotificationsProcessor {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Process('sendNotification')  // The type of the job we're processing
  async handleSendNotification(job: Job) {
    const { bookTitle, userId } = job.data;

    // Use NotificationsService to send the notification
    await this.notificationsService.sendNotification(bookTitle, userId);

    console.log(`Notification for book "${bookTitle}" sent to user ${userId}`);
  }
}
