import { Request } from '@nestjs/common';
import { User } from '../entities/user.entity';

export interface TokenPayload {
  name: string;
  sub: number;
  type: JwtType;
}

export interface RequestWithUser extends Request {
  user: User;
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN'
}
