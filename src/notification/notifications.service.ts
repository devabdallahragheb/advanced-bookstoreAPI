import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  // Simulating sending a notification
  async sendNotification(bookTitle: string, userId: string): Promise<void> {
    // For now, let's just log the notification
    console.log(`Sending notification: New book "${bookTitle}" added by user ${userId}`);
    
 
  }
}
