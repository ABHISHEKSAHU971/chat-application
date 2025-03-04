import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { ChatController } from '@/controllers/chat.controller';

export class ChatRoute implements Routes {
public path = '/chat';
  public router = Router();
  public chatController = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/message`, AuthMiddleware([]), this.chatController.sendMessage);
    this.router.get(`${this.path}/messages/:room`, AuthMiddleware([]), this.chatController.getMessages);
    this.router.post(`${this.path}/join-room`, AuthMiddleware([]), this.chatController.joinRoom);
    this.router.post(`${this.path}/leave-room`, AuthMiddleware([]), this.chatController.leaveRoom);




  }
}
