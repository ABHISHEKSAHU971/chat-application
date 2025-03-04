import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { DB } from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { HttpException } from '@/exceptions/HttpException';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await DB.Users.findAll();
    return allUser;
  }


  // public async createUser(userData: CreateUserDto): Promise<User> {
  //   const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
  //   if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

  //   const hashedPassword = await hash(userData.password, 10);
  //   const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });
  //   return createUserData;
  // }

 
}
