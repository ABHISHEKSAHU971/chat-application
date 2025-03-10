import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import constants from '@/constants';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    
    this.router.get(`${this.path}`, this.user.getUsers);
    // this.router.post(`${this.path}`, AuthMiddleware([constants.scope.ADMIN]),ValidationMiddleware(CreateUserDto), this.user.createUser);

  }
}
