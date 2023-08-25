import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewUserEvent } from "../../events/new.user.event";


@Injectable()
export class NotificationsService {
    @OnEvent('new.user')
    async notifyUser (payload: NewUserEvent) {
        console.log(`New user with name ${payload.name} has been created.`)
    }
}
