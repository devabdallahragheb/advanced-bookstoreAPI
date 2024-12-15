import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications', // Queue name
    }),
  ],
  providers: [NotificationsService, NotificationsProcessor],
  exports: [BullModule],  // Export BullModule to make the queue available in other modules
})
export class NotificationsModule {}
