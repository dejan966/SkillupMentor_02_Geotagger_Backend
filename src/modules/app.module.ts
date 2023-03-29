import { ClassSerializerInterceptor, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { GuessesModule } from './guesses/guesses.module';
import { ComponentsModule } from './components/components.module';
import { ActionsModule } from './actions/actions.module';
import { LogsModule } from './logActions/logs.module';
import { configValidationSchema } from 'src/config/schema.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesModule } from './roles/roles.module';
import { JwtService } from '@nestjs/jwt';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: configValidationSchema
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    LocationsModule,
    GuessesModule,
    ActionsModule,
    ComponentsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR, 
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    AppService,
    JwtService
  ],
})
export class AppModule {
/*   configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  } */
}
