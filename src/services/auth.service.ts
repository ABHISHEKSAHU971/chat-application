
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/HttpException';
import bcrypt from 'bcryptjs';
import { UserModel } from '@models/users.model';
import { generateToken } from '@utils/jwt.utils';
import { io } from '../websocket/socket';



const activeSessions = new Map<string, string>();

@Service()
export class AuthService {
  static login(email: any, password: any): { token: any; user: any; } | PromiseLike<{ token: any; user: any; }> {
    throw new Error('Method not implemented.');
  }

  async signup(email: string, password: string) {
    const existingUser = await UserModel.findOne({ where: { email } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ email, password: hashedPassword });

    const token = generateToken(newUser.id);
    await newUser.update({ token });
    return { token, user: newUser };
  }

  async login(email: string, password: string) {
    console.log("=========85")
    const user = await UserModel.findOne({ where: { email } }); 
    console.log("=========", user)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);
    await user.update({ token });
    console.log("token====", user.id, token )
    if (activeSessions.has(user.id.toString())) {
      const existingSocketId = activeSessions.get(user.id.toString());
      io.to(existingSocketId!).emit('logout', { message: 'Logged in from another device' });
    }

    activeSessions.set(user.id.toString(), token);

    return { token, user };
  }

  async logout(userId: number) {
    await UserModel.update({ token: null }, { where: { id: userId } });
  }
  
}
