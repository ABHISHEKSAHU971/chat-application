import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', ValidationMiddleware(CreateUserDto), this.auth.login);
    this.router.post('/signup', ValidationMiddleware(CreateUserDto), this.auth.signup);
    this.router.post('/logout', ValidationMiddleware(CreateUserDto), this.auth.logout);


  }
}
