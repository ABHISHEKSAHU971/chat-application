import { Server } from 'socket.io';
import { WebSocketService } from '@services/socket.service';

export let io: Server;

export function initializeWebSocket(server: any) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    WebSocketService.initialize(io);
}
