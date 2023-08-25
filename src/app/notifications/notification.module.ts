import { Module } from '@nestjs/common';
import {NotificationsService} from "./notification.service";

@Module({
    imports: [],
    controllers: [],
    providers: [NotificationsService],
})
export class NotificationModule {}
