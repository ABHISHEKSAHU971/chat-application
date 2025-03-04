import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import { verifyToken } from '@/utils/jwt.utils';

export class AuthController {
  public auth = Container.get(AuthService);

  constructor() {
    this.login = this.login.bind(this); 
  }

  signup = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.auth.signup(email, password);

      return res.status(201).json({ token, user });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("----", email, password)
      const { token, user } = await this.auth.login(email, password);

      return res.json({ token, user });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: 'Not logged in' });

      const decoded = verifyToken(token);
      await this.auth.logout(decoded.userId);

      return res.json({ message: 'Logged out successfully' });
    } catch {
      return res.status(400).json({ message: 'Invalid token' });
    }
  }
}
