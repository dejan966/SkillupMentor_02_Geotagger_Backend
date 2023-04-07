import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { access_token } = req.cookies;
    try {
      const { sub } = await this.jwtService.verifyAsync(access_token);
      req.user = await this.userService.findById(sub);
    } catch {}
    next();
  }
}
