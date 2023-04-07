import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Logging from 'library/Logging';
import { UsersService } from 'modules/users/users.service';

export const GetCurrentUser = createParamDecorator((_: undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;
  return user;
});
