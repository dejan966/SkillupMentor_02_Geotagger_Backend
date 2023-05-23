import { Module } from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { GuessesController } from './guesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from 'entities/guess.entity';
import { LocationsService } from '../locations/locations.service';
import { Location } from 'entities/location.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess]),
    TypeOrmModule.forFeature([Location]),
  ],
  controllers: [GuessesController],
  providers: [GuessesService, LocationsService, JwtService],
})
export class GuessesModule {}
