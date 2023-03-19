import { Module } from '@nestjs/common';
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
import { LogsModule } from './logs/logs.module';
import { configValidationSchema } from 'src/config/schema.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: configValidationSchema
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    LocationsModule,
    GuessesModule,
    ActionsModule,
    ComponentsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
