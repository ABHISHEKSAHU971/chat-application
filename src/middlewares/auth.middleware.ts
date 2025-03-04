import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DB } from '@database';
import { UserModel } from '@models/users.model';
import dotenv from 'dotenv';
import { HttpException } from './../exceptions/HttpException';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

export interface RequestWithUser extends Request {
  user?: UserModel;
}

export const AuthMiddleware = (requiredScopes: string[] = []) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token =  req.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new HttpException(401, 'Authentication token missing'));
      }
      console.log("token====" , token)

      const decoded:any = jwt.verify(token, SECRET_KEY) as { id: number };
      console.log("decode======", decoded)
      const user = await DB.Users.findOne({ where: { token: token } });


      console.log("user======",user)
      if (!user) {
        return next(new HttpException(401, 'Invalid authentication token'));
      }

      req.user = user; 

      next(); 
    } catch (error) {
      return next(new HttpException(401, 'Invalid authentication token'));
    }
  };
};
