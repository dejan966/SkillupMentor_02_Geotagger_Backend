import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
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
import { configValidationSchema } from 'config/schema.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RolesModule } from './roles/roles.module';
import { UtilsModule } from './utils/utils.module';
import { PasswordResetTokensModule } from './password_reset_tokens/password_reset_tokens.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    MailerModule.forRoot({
      transport:{
        host:'smtp.sendgrid.net',
        auth:{
          user:process.env.SMTP_USER,
          pass:process.env.SMTP_PASS
        }
      }
    }),
    DatabaseModule,
    UtilsModule,
    AuthModule,
    PasswordResetTokensModule,
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
      useClass: ClassSerializerInterceptor,
    },
    AppService,
  ],
})
export class AppModule {
  /*   configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  } */
}
