import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService:JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('log')
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest()
    
    if (isPublic) return true
    
    try{
      const access_token = request.cookies['access_token']

/*       console.log(this.jwtService.verify(access_token,{secret:'5a8b76f64965d28558d0a4bbbac949fc2a732bccb6fd36b7318d6a4e08776052'}))
      console.log(!!this.jwtService.verify(access_token, {secret:'5a8b76f64965d28558d0a4bbbac949fc2a732bccb6fd36b7318d6a4e08776052'}), !!!this.jwtService.verify(access_token, {secret:'5a8b76f64965d28558d0a4bbbac949fc2a732bccb6fd36b7318d6a4e08776052'}))
      console.log(access_token) */
      if(!access_token || !!!this.jwtService.verify(access_token))
      {
        return false
      }
      
      return super.canActivate(context)
    } catch(error){
      return false
    }
  }
/*   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])
    const request = context.switchToHttp().getRequest()

    //if (isPublic) return true

    try {
      const access_token = request.cookies['access_token']
      console.log(!!this.jwtService.verify(access_token), this.jwtService.verify(access_token))
      return !!this.jwtService.verify(access_token)
    } catch (error) {
      return false
    }
  } */
}
