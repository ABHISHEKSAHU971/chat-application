import { Server, Socket } from 'socket.io';
import { verifyToken } from '@utils/jwt.utils';
import { ChatService } from '@services/chat.service';

const activeSessions = new Map<string, string>();

export const WebSocketService = {
    initialize(io: Server) {
        io.use((socket, next) => {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error('Authentication error'));

            try {
                const decoded = verifyToken(token);
                socket.data.userId = decoded.userId;

                if (activeSessions.has(decoded.userId)) {
                    const existingSocketId = activeSessions.get(decoded.userId);
                    io.to(existingSocketId!).emit('logout', { message: 'Logged in from another device' });
                }

                activeSessions.set(decoded.userId, socket.id);
                next();
            } catch (error) {
                next(new Error('Authentication error'));
            }
        });

        io.on('connection', (socket: Socket) => {
            console.log(`User connected: ${socket.data.userId}`);

            socket.on('joinRoom', (room) => {
                socket.join(room);
                console.log(`User ${socket.data.userId} joined room: ${room}`);
                socket.to(room).emit('userJoined', { userId: socket.data.userId, message: `User joined ${room}` });
            });

            socket.on('message', async ({ room, message }) => {
                console.log(`Message in ${room} from ${socket.data.userId}: ${message}`);

                await ChatService.saveMessage(socket.data.userId, room, message);

                io.to(room).emit('message', { userId: socket.data.userId, message });
            });

            socket.on('leaveRoom', (room) => {
                socket.leave(room);
                console.log(`User ${socket.data.userId} left room: ${room}`);
                socket.to(room).emit('userLeft', { userId: socket.data.userId, message: `User left ${room}` });
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.data.userId}`);
                activeSessions.delete(socket.data.userId);
            });
        });
    },
};
