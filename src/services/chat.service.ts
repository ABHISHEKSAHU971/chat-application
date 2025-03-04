import { io } from '@/websocket/socket';
import { ChatMessageModel } from '@models/chatMessage.model';

export const ChatService = {
    async saveMessage(userId: number, room: string, message: string) {
        return await ChatMessageModel.create({ userId, room, message, type: 'message' });
    },

    async getMessages(room: string) {
        return await ChatMessageModel.findAll({ where: { room }, order: [['createdAt', 'ASC']] });
    },

    async joinRoom(userId: number, room: string) {
        const sockets = await io.fetchSockets();
        const userSocket = sockets.find((socket) => socket.data.userId === userId);

        if (userSocket) {
            userSocket.join(room);
            io.to(room).emit('userJoined', { userId, message: `User ${userId} joined ${room}` });

            await ChatMessageModel.create({ userId, room, message: `User ${userId} joined`, type: 'join' });
        } else {
            throw new Error('User socket not found');
        }
    },

    async leaveRoom(userId: number, room: string) {
        const sockets = await io.fetchSockets();
        const userSocket = sockets.find((socket) => socket.data.userId === userId);

        if (userSocket) {
            userSocket.leave(room);
            io.to(room).emit('userLeft', { userId, message: `User ${userId} left ${room}` });

            await ChatMessageModel.create({ userId, room, message: `User ${userId} left`, type: 'leave' });
        } else {
            throw new Error('User not connected to the room');
        }
    }
};
