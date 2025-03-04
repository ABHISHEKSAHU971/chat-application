import { Request, Response } from 'express';
import { ChatService } from '@services/chat.service';

export class ChatController {
    async sendMessage(req, res: Response) {
        try {
            const { room, message } = req.body;
            console.log("kkkkkkk", room, message)
            const userId = req.user.id; 

            const savedMessage = await ChatService.saveMessage(userId, room, message);
            return res.status(200).json({ success: true, data: savedMessage });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const { room } = req.params;
            const messages = await ChatService.getMessages(room);
            return res.status(200).json({ success: true, data: messages });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async joinRoom(req, res) {
        try {
            const { room } = req.body;
            const userId = req.user?.id;

            if (!room) {
                return res.status(400).json({ message: 'Room name is required' });
            }

            await ChatService.joinRoom(userId, room);
            return res.json({ message: `User ${userId} joined room ${room}` });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    

    async leaveRoom(req, res) {
        try {
            const { room } = req.body;
            const userId = req.user?.id;

            if (!room) {
                return res.status(400).json({ message: 'Room name is required' });
            }

            await ChatService.leaveRoom(userId, room);
            return res.json({ message: `User ${userId} left room ${room}` });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
